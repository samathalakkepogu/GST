# Product Requirements Document (PRD)
## GST Bill Verifier + GST Calculator

**Version:** 1.0  
**Product:** GST Bill Verifier  
**Platform:** Web Application  
**Primary Market:** India  
**Primary Goal:** Help users verify whether the GST charged on an invoice is correct.

---

# 1. Product Overview

GST Bill Verifier is a simple web application that helps Indian users check whether the GST shown on a purchase invoice is correct.

The application should answer two main questions:

1. **Is the GST rate charged on my invoice correct?**
2. **Is the GST amount calculated on my invoice correctly?**

A secondary feature will provide a simple GST Calculator for users who want to calculate GST manually.

### Core Product Principle

The application must be:

**DATE-AWARE + CLASSIFICATION-AWARE + CALCULATION-AWARE**

---

# 2. Main User Problem

Most customers receive GST invoices but do not know:

- Whether the seller applied the correct GST rate
- Whether the GST amount was calculated correctly
- Whether CGST + SGST is correct
- Whether IGST is correct
- Whether the final invoice total is mathematically correct
- Which HSN/SAC code applies
- Whether an older invoice should use an older GST rate

The application should make this verification simple for an ordinary user.

The user should **not need to know the HSN/SAC code** to start verification.

---

# 3. Target Users

### Primary Users

- Individual consumers
- Small business owners
- Freelancers
- Shop owners
- Account assistants
- Students learning GST
- Anyone checking a retail or business invoice

### Example

A customer purchases a laptop from a retail store.

The invoice says:

- Product: Laptop
- Taxable Amount: ₹50,000
- GST Rate: 18%
- GST Amount: ₹9,000
- Total: ₹59,000

The user enters these details.

The application checks:

- Applicable GST classification
- Applicable GST rate for the invoice date
- GST calculation
- CGST/SGST or IGST
- Invoice total

Then gives a simple result.

---

# 4. Main Navigation

The home page should have two primary options:

### Button 1
**Check My Invoice**

Main feature.

### Button 2
**GST Calculator**

Secondary feature.

Additional:

- About
- Disclaimer

Do NOT make a large Rate Explorer the main feature.

---

# 5. Main User Flow

## Step 1 — Invoice Date

Ask:

**Invoice Date**

Example:

`15/08/2026`

This field should be required for invoice verification.

### Important

The GST rate must be determined based on the **invoice date**, not simply today's GST rate.

This is necessary because GST rates can change over time.

Example:

- Old invoice → use historical applicable rate
- New invoice → use applicable rate for that date

Display a small note:

> **GST rate is checked based on the invoice date entered.**

---

# 6. Seller and Buyer State

Ask:

### Seller State
Dropdown containing Indian states and union territories.

### Buyer State
Dropdown containing Indian states and union territories.

The application automatically determines:

### Same State

Use:

**CGST + SGST/UTGST**

### Different States

Use:

**IGST**

The user should not have to manually select CGST/SGST/IGST.

---

# 7. Invoice Item Entry

Allow the user to add one or more invoice items.

Each item should contain:

### Product / Service Name

Required.

Example:

- Almonds
- Laptop
- Mobile phone
- Saree
- Chair
- Software service
- Hotel service

### HSN/SAC

Optional.

The user should NOT be forced to know HSN/SAC.

### Quantity

Optional depending on product.

### Taxable Amount

Required.

Example:

`₹1,000`

### GST Rate Shown on Invoice

Required.

Example:

`18%`

### GST Amount Shown on Invoice

Required.

Example:

`₹180`

### Invoice Total

Optional at item level if the overall invoice total is entered separately.

---

# 8. Intelligent Product Search

This is an important feature.

Users should be able to type normal product names instead of knowing HSN codes.

### Example

User enters:

**Almonds**

Application should search the GST reference database and find relevant classifications such as:

**Almonds / Badam**

The application should then show the relevant possible classification and applicable GST information.

### Other examples

| User enters | Application should understand |
|---|---|
| Almonds | Almonds / Badam |
| Badam | Almonds |
| Mobile | Mobile phone |
| Laptop | Portable computer / laptop classification |
| Saree | Saree / relevant textile classification |
| Chair | Chair / relevant furniture classification |
| Shoes | Footwear classification |
| Software | Relevant software/service classification |

The search should support:

- Exact matches
- Partial matches
- Keywords
- Synonyms
- Common Indian names
- Spelling variations
- HSN codes
- SAC codes
- Official descriptions

---

# 9. Classification Handling

The application must NOT blindly guess a GST classification.

If there is only one strong match:

**Likely Match**

If there are multiple possible classifications:

> **We found multiple possible classifications. Please select the one that best matches your product/service.**

Show the possible choices.

Example:

**You entered: Software**

Possible classifications:

- Software supplied as goods
- Software-related service
- Other software/service classification

The user selects the appropriate option.

If the description is insufficient:

> **We need more information about this product/service to verify the GST rate.**

---

# 10. GST Reference Database

The application should maintain an internal GST reference database.

Each record should contain:

- HSN/SAC
- Product/service description
- Search keywords
- Synonyms
- GST rate
- CGST rate
- SGST/UTGST rate
- IGST rate
- Effective From Date
- Effective To Date
- Conditions/exceptions where applicable
- Classification confidence

Example structure:

```text
HSN/SAC
Description
Keywords
GST Rate
CGST
SGST
IGST
Effective From
Effective To
Conditions
Confidence
```

The database must support **multiple historical records for the same HSN/SAC**.

Example:

```text
HSN XXXX
GST Rate: 12%
Effective From: Old Date
Effective To: New Date - 1 day

HSN XXXX
GST Rate: 18%
Effective From: New Date
Effective To: Current
```

The application selects the correct record using the invoice date.

---

# 11. GST Rate Verification

This is the primary verification.

Compare:

### GST Rate on Invoice

against

### Applicable GST Rate for the invoice date and selected classification.

---

## Result 1 — Match

If invoice rate = applicable rate:

### ✅ GST Rate: Matches

Example:

```text
GST Rate on Invoice: 18%
Applicable GST Rate: 18%

GST Rate: Matches
```

---

## Result 2 — Possible Mismatch

If invoice rate differs:

### ⚠️ Possible GST Rate Mismatch

Example:

```text
GST Rate on Invoice: 18%
Applicable GST Rate: 12%

Possible GST Rate Mismatch
```

Do not immediately state that the seller is definitely wrong because exemptions, conditions, classification and transaction-specific rules may affect GST treatment.

---

## Result 3 — Unable to Confirm

If classification cannot be reliably determined:

### ℹ️ Unable to Confirm GST Rate

Example:

> We need more information about this product/service to verify the GST rate.

---

# 12. GST Calculation Verification

Rate verification and calculation verification must be treated as **two separate checks**.

This is very important.

A seller could:

### Case A
Use the correct GST rate but calculate the GST amount incorrectly.

### Case B
Calculate the GST amount correctly but use the wrong GST rate.

Therefore, the application must independently calculate GST.

---

# 13. GST Calculation Logic

Example:

Taxable Amount:

`₹1,000`

GST Rate:

`18%`

Expected GST:

`₹180`

If invoice GST is:

`₹180`

Show:

### ✅ GST Calculation: Correct

If invoice GST is:

`₹200`

Show:

### ⚠️ GST Calculation: Difference

Display:

```text
Expected GST: ₹180
Invoice GST: ₹200
Difference: ₹20
```

---

# 14. CGST + SGST Verification

For intra-state transactions:

Example:

Taxable Amount = ₹1,000

GST = 18%

Expected:

```text
CGST: ₹90
SGST: ₹90
Total GST: ₹180
```

Verify the invoice values independently.

Possible result:

### ✅ CGST/SGST: Correct

or

### ⚠️ CGST/SGST Difference

Show the expected and invoice amounts clearly.

---

# 15. IGST Verification

For inter-state transactions:

Example:

Taxable Amount = ₹1,000

GST = 18%

Expected:

```text
IGST: ₹180
```

Verify the invoice IGST amount.

Result:

### ✅ IGST: Correct

or

### ⚠️ IGST Difference

---

# 16. Invoice Total Verification

The application should independently calculate:

**Taxable Amount + GST + Cess, where applicable**

and compare it with the invoice total.

Example:

```text
Taxable Amount: ₹1,000
GST: ₹180
Expected Total: ₹1,180
Invoice Total: ₹1,180

✅ Invoice Total: Correct
```

If invoice total is ₹1,200:

```text
Expected Total: ₹1,180
Invoice Total: ₹1,200
Difference: ₹20

⚠️ Invoice Total Difference
```

Support a small configurable rounding tolerance.

---

# 17. Overall Verification Result

After all checks, show a simple summary.

Example:

## Invoice Verification Result

**Product:** Laptop

**Invoice Date:** 15/08/2026

### GST Rate
✅ Matches

### GST Calculation
✅ Correct

### CGST
✅ Correct

### SGST
✅ Correct

### Invoice Total
✅ Correct

### Overall
**Invoice GST details appear consistent with the information entered.**

---

# 18. Mismatch Result

Example:

## Invoice Verification Result

### GST Rate
⚠️ Possible GST Rate Mismatch

### GST Calculation
✅ Correct

### CGST
❌ Difference

### SGST
❌ Difference

### Invoice Total
⚠️ Difference

Provide a simple explanation.

Do not use complicated tax terminology unless necessary.

---

# 19. Confidence Levels

The application should have:

### High Confidence

Classification and applicable rate can be confidently determined.

### Medium Confidence

There are some classification/condition uncertainties.

### Unable to Confirm

Insufficient information.

The application should never present an uncertain classification as a confirmed legal conclusion.

---

# 20. Historical GST Rate Support

The application must support historical invoices.

The system should use:

**Invoice Date → Classification → Applicable Historical GST Rate**

NOT:

**Today's Rate → Every Invoice**

Example:

If a user enters an invoice from an earlier year, the system should check the rate applicable on that invoice date.

This prevents incorrect verification of old invoices.

---

# 21. GST Calculator

GST Calculator is the secondary feature.

Provide two simple modes.

## A. Add GST

User enters:

- Amount
- GST Rate

Example:

```text
Amount: ₹1,000
GST Rate: 18%

GST: ₹180
Total: ₹1,180
```

## B. Remove GST

User enters:

- GST-inclusive amount
- GST rate

Example:

```text
Amount including GST: ₹1,180
GST Rate: 18%

Original Amount: ₹1,000
GST: ₹180
```

---

# 22. Quick GST Rates

Provide quick selection buttons:

- 0%
- 5%
- 12%
- 18%
- 28%

Also provide:

**Custom Rate**

The user can enter another rate if required.

The calculator should not assume that these rates apply to every product/service. They are only calculator options.

---

# 23. Currency

For MVP:

**Indian Rupee (₹)** only.

Use Indian number formatting.

Examples:

- ₹1,000
- ₹10,000
- ₹1,00,000
- ₹10,00,000

Use up to 2 decimal places where required.

---

# 24. User Interface Requirements

The application should be extremely simple.

Avoid overwhelming users with:

- Long GST tables
- Notification numbers
- Gazette references
- Technical tax terminology
- Large HSN/SAC lists
- Complicated tax rules

The user should primarily see:

**Enter → Check → Understand Result**

---

# 25. Home Page

Headline:

## Check Your GST Invoice

Subheading:

> Quickly check whether the GST rate and GST calculation on your invoice match the information entered.

Primary button:

**Check My Invoice**

Secondary button:

**GST Calculator**

---

# 26. Invoice Verification Page

Recommended layout:

### Step 1
Invoice Date

### Step 2
Seller State

### Step 3
Buyer State

### Step 4
Add Product/Service

### Step 5
Enter Invoice GST Details

### Step 6
Verify Invoice

The interface should support:

**+ Add Another Item**

for invoices containing multiple products/services.

---

# 27. Results Page

Use clear visual sections:

### Product Classification

Matched product/service.

### GST Rate Check

Invoice rate vs applicable rate.

### GST Calculation Check

Invoice GST vs expected GST.

### Tax Type Check

CGST + SGST or IGST.

### Invoice Total Check

Expected total vs invoice total.

### Overall Result

Simple conclusion.

---

# 28. Error Handling

If the user enters incomplete information:

> Please enter the required invoice details.

If product cannot be classified:

> We need more information about this product/service.

If multiple classifications are found:

> Please select the product/service that best matches your invoice.

If a broad SAC such as **9996** is entered without a service description:

> The exact service description is required to determine the applicable GST treatment.

Do not automatically assign one GST rate to a broad classification when the exact service cannot be determined.

---

# 29. Data Accuracy Requirements

GST rates should be maintained using reliable official GST reference data.

The application should support:

- Current rates
- Historical rates
- Effective dates
- Rate changes
- Classification changes
- Applicable conditions
- Exceptions where required

The database must be updateable without changing the application code.

---

# 30. User-Facing Official References

Do **not** display notification numbers, Gazette references or long official source details in the normal verification result.

The application can maintain official reference information internally for data maintenance and audit purposes.

The user experience should remain simple.

---

# 31. Disclaimer

Display the following disclaimer in the application:

**Disclaimer:** GST Bill Verifier is an informational verification tool. Results are based on the information entered by the user, the selected product/service classifications, and GST reference data maintained by the application. GST treatment may vary depending on product classification, exemptions, conditions, place of supply, and other transaction-specific rules. A verification result does not constitute legal, accounting, or tax advice.

Also display:

> **GST rate is checked based on the invoice date entered.**

---

# 32. MVP Scope

## Must Have

1. Invoice Date
2. Seller State
3. Buyer State
4. Product/Service Name
5. Optional HSN/SAC
6. Product search
7. GST classification matching
8. Date-aware GST rates
9. Historical GST rates
10. GST Rate Verification
11. GST Calculation Verification
12. CGST/SGST verification
13. IGST verification
14. Invoice Total verification
15. Clear match/mismatch result
16. Confidence level
17. Multiple invoice items
18. GST Calculator
19. Disclaimer

---

# 33. Future Features

These should NOT complicate the MVP.

Possible future versions:

- Upload invoice image
- OCR invoice scanning
- PDF invoice upload
- Automatic extraction of GST details
- Automatic HSN/SAC detection
- GSTIN verification
- Seller invoice verification
- Download verification report
- Save previous invoices
- Multi-language support
- Telugu support
- Advanced tax explanations

---

# 34. Non-Goals for MVP

Do not build these initially:

- Full accounting software
- GST return filing
- GST registration
- E-invoice generation
- Legal/tax advisory
- Complete GST law interpretation engine
- Huge public-facing HSN/SAC explorer

The main goal remains:

## **“Check whether the GST on my invoice is correct.”**

---

# 35. Success Criteria

The application should allow a normal user to complete invoice verification without knowing HSN/SAC.

A successful user journey should be:

**Enter invoice date → Enter product name → Enter invoice GST → Click Verify → Understand result**

within a few simple steps.

The user should clearly understand:

1. What GST rate the application found
2. Whether the invoice rate matches
3. Whether the GST calculation is correct
4. Whether CGST/SGST or IGST is correct
5. Whether the invoice total is correct
6. When the application cannot confidently determine the GST treatment

---

# 36. Core Product Rule

The application must NEVER simply answer:

> “GST = 18%”

without considering:

**Invoice Date + Product/Service Classification + Applicable Conditions**

The verification engine should follow:

### Invoice Date
↓
### Product/Service Identification
↓
### HSN/SAC Classification
↓
### Applicable GST Rate for That Date
↓
### Compare Invoice GST Rate
↓
### Independently Calculate GST
↓
### Verify CGST/SGST/IGST
↓
### Verify Invoice Total
↓
### Show Simple Result

---

# 37. Final Product Positioning

### Main Feature

**GST Bill Verifier**

> Check whether the GST charged on your invoice is correct.

### Secondary Feature

**GST Calculator**

> Quickly calculate GST on any amount.

The application should prioritize **invoice verification over GST rate browsing**.

The key differentiator is:

## **Date-aware GST invoice verification without requiring the user to know HSN/SAC.**