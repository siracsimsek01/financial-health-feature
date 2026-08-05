# Decisions

## Problem framing
I interpreted the task as a feedback layer on top of income and
expenditure data that Ophelos already collects.

The core customer questions I want the feature to answer are:

1. Where do I stand financially this month?
2. What is driving that assessment?
3. Is my position improving or worsening over time?

I deliberately did not treat the task as building another budgeting
or income/expenditure entry experience.

## Scope

I am building a small Next.js application focused on:

- monthly income and expenditure summary
- remaining monthly income
- an explainable affordability assessment
- historical financial position
- month-on-month trend information

I am prioritising the required customer experience before considering
the stretch requirements.

## Affordability model

The primary calculation is:

remaining income = total income - total regular expenditure

I considered introducing a single financial-health score, but rejected
it because it would require arbitrary thresholds and could imply a
level of precision that the available data does not support.

The application instead exposes the underlying values and uses a
small number of descriptive states.

An expenditure-to-income ratio is used as supporting information when
income is greater than zero.

When income is zero, the ratio is represented as unavailable rather
than allowing Infinity or NaN to reach the customer interface.

## Historical tracking

Financial statements are modelled as monthly snapshots.

Historical values are not mutated when a newer statement is added,
which allows the customer's reported position to be compared over
time.

Remaining income is the initial primary signal used when comparing
consecutive periods.

## Customer communication

## Data and regulated context

## Testing strategy

## What I deliberately left out

## What I would do next

## Time spent