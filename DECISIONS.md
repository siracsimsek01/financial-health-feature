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

This means remaining income represents what is left after the
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

The trend for a selected month compares that statement with the
previous available statement using the change in remaining income.

I use the change in pounds rather than percentage change because
percentages become confusing when the previous value is zero or
negative.

Statements are sorted by their `YYYY-MM` period before comparison.

If a month is missing, I compare the latest two available statements
rather than trying to infer missing data.

Customers can select a month through the chart or month controls. The
summary, affordability assessment, trend and breakdown then use the
same selected statement.

The selected month is the only meaningful UI state. All financial
results are still derived from the tested domain functions.

## Monetary representation

For this take-home, monetary values are represented as JavaScript
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

A “How is this calculated?” disclosure explains the main calculation
without adding unnecessary detail to the default view.

## Data and regulated context

The take-home uses local mock data and does not send customer financial
information to external services.

The affordability assessment is deterministic and can be explained
directly from the customer's recorded income and outgoings.

The result is informational and is not presented as financial advice.

In production, I would expect authentication, authorisation, secure
storage, auditability and appropriate data-retention policies to be
handled by the wider platform.

I would also want the customer-facing wording and any affordability
rules reviewed with the relevant product and compliance teams before
release.

This take-home considers the regulated context, but it does not claim
that the feature itself is FCA compliant.

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

I kept these tests focused on behaviour rather than implementation
details.

Playwright tests cover the main customer flows across desktop and
mobile configurations, including:

- selecting historical months
- keeping the summary, assessment, trend and breakdown consistent
- balanced and deficit states
- returning to the latest month
- keyboard interaction and visible keyboard focus
- the affordability explanation
- responsive layout
- PDF export for the selected statement

## What I deliberately left out

I did not build income or expenditure editing because the brief says
that functionality already exists.

I did not add authentication, persistence or a backend because mock
data is enough to demonstrate the feature and a fake backend would not
improve the core customer experience.

I did not use AI to decide the customer's financial position. The
assessment is deterministic so it remains easy to test and explain.

I did not add secure statement sharing because doing it properly would
require token expiry, persistence and access-control decisions that are
outside the scope of this frontend take-home.

I did implement branded PDF export for the selected statement. It is
generated in the browser using the same tested financial results shown
on screen, so the mock customer data is not sent to an external
service.

## What I would do next

If I continued the feature, I would:

1. Connect it to Ophelos' existing income and expenditure data.
2. Validate the affordability wording and rules with product and
   compliance.
3. Run the browser tests in CI and expand them as the feature evolves.
4. Test the experience with real customers and accessibility tools.
5. Confirm production security, audit and retention requirements.
6. Implement secure, time-limited statement sharing once the required
   authentication, persistence and access-control model is clear.

## Time spent

Approximately 2.5 hours in total, including planning, implementation,
testing, UI refinement and documentation.