import pandas as pd

# Load dataset
df = pd.read_csv("evidence intell.csv")

# ----------------------------
# Overall Completeness
# ----------------------------

overall_completeness = round(
    df["Completeness_Percentage"].mean(),
    1
)

# ----------------------------
# Most Missing Evidence
# ----------------------------

most_missing = df.sort_values(
    by="Missing_Cases",
    ascending=False
).iloc[0]

# ----------------------------
# Total Incomplete Cases
# ----------------------------

total_incomplete = int(
    df["Missing_Cases"].sum()
)

# ----------------------------
# OUTPUT
# ----------------------------

print("\n========== EVIDENCE INTELLIGENCE DASHBOARD ==========\n")

print(f"Overall Evidence Completeness : {overall_completeness}%\n")

print("Evidence Status:\n")

for _, row in df.iterrows():

    print(
        f"{row['Evidence_Type']} | "
        f"Completeness: {row['Completeness_Percentage']}% | "
        f"Missing Cases: {row['Missing_Cases']}"
    )

print("\n---------------------------------------------------")

print(
    f"\nMost Missing Evidence : "
    f"{most_missing['Evidence_Type']}"
)

print(
    f"Missing Cases : "
    f"{most_missing['Missing_Cases']}"
)

print(
    f"\nCases With Incomplete Evidence : "
    f"{total_incomplete}"
)

print("\n===================================================")