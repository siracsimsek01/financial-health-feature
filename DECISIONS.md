# Decisions

## Problem framing

I treated this feature as a feedback layer on top of the income and
expenditure data Ophelos already collects.

The goal is to help customers understand:

1. Where they stand financially now.
2. Why they are seeing that result.
3. Whether their position is improving or getting worse over time.

I did not build income or expenditure entry because the brief says
this already exists.

## Scope

I treat the provided expenditure as existing regular outgoings,
including the example loan repayment.

this means remaining income represents what is left after the
customer's recorded commitments.

For a production version, I would confirm this assumption against
Ophelos' existing financial data model.

## Affordability model

The main calculation is:

`remaining income = total income - total expenditure`

I chose not to create a financial health score because that would
require inventing thresholds for what counts as good or bad.

Instead, I use four simple states:

- surplus
- balanced
- deficit
- no income

I also calculate expenditure as a proportion of income when income is
greater than zero.

When income is zero, the ratio is unavailable.

Money comparisons are done at pence precision to avoid JavaScript
floating-point errors affecting the customer's status.

`no-income` takes priority when total income is zero, but the remaining
amount is still shown so any shortfall remains visible.

## Historical tracking

Each statement represents one monthly snapshot.

Trend compares the latest statement with the previous available
statement using the change in remaining income.

I use the change in pounds rather than percentage change because
percentages become confusing when the previous value is zero or
negative.

Statements are sorted by their `YYYY-MM` period before comparison.

If a month is missing, I compare the latest two available statements
rather than trying to infer missing data.

Customers can select any available month from the history chart or
month controls.

The selected month becomes the source for the summary, affordability
assessment and detailed breakdown, while "Back to latest" returns the
customer to their current position.

I kept the selected month as the only meaningful UI state. Financial
values continue to be derived from the same tested domain functions.

## Monetary representation

For this take home, monetary values are represented as JavaScript
numbers in pounds.

Calculations that affect financial states are normalised to pence
before comparison to avoid floating-point rounding problems.

In production, I would follow the monetary representation already used
by the wider Ophelos platform.


## Customer communication 

The UI uses clear and non-judgemental language.

I avoided labels such as good or bad financial health. Instead, the
app explains the customer's position using their actual income,
outgoings and remaining income.

The affordability result is presented as information, not financial
advice.

The design avoids relying on colour alone to communicate status.

I also added a "How is this calculated?" explanation so customers can
understand where the assessment comes from without adding complexity
to the main view.

## Data and regulated context
## Testing strategy

I focused tests on financial behaviour that could give the customer an
incorrect result.

The domain tests cover:

- surplus, balanced and deficit states
- zero income and zero expenditure
- floating-point rounding
- multiple income and expenditure items
- improving, worsening and unchanged trends
- insufficient history
- unsorted statements
- improving while still in deficit

There are 17 domain tests in total.

I kept these tests focused on behaviour rather than implementation
details.

I also manually exercised the interactive dashboard flow in different browsers,
including mouse and keyboard month selection, historical states,
returning to the latest statement, the calculation disclosure and
keyboard focus behaviour.

 ## What I deliberately left out

I did not build income or expenditure editing because the brief says
that functionality already exists.

I did not add authentication, persistence or a backend because mock
data is enough to demonstrate the feature and a fake backend would not
improve the core customer experience.

I did not use AI to decide the customer's financial position. The
assessment is deterministic so it remains easy to test and explain.

I also chose not to implement the stretch features such as secure
statement sharing and PDF export. I prioritised completing and
polishing the core customer experience first. 

## What I would do next 
If I continued the feature, I would:

1. Connect it to Ophelos' existing income and expenditure data.
2. Validate the affordability wording with product and compliance.
3. Add automated browser tests for the main interactive flows.
4. Test the experience with real customers and accessibility tools.
5. Consider secure sharing and PDF export once the core experience is
   validated.

## Time spent

Approximately 2 hours in total, including planning, implementation,
testing, UI refinement and documentation.