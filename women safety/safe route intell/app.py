import pandas as pd

# ----------------------------
# LOAD DATASET
# ----------------------------

df = pd.read_csv(
    "data/safe_route_dataset.csv"
)

# ----------------------------
# SAFETY SCORE LOGIC
# ----------------------------

lighting_score = {
    "Poor": 1,
    "Medium": 2,
    "Good": 3
}

patrol_score = {
    "Low": 1,
    "Medium": 2,
    "High": 3
}

def calculate_safety_score(row):

    lighting = row["Lighting"].strip()
    patrol = row["Patrol"].strip()

    score = (
        (row["CCTV_Count"] * 2)
        + (lighting_score[lighting] * 10)
        + (patrol_score[patrol] * 10)
        - (row["Incidents"] * 2)
    )

    return max(score, 0)

df["Safety_Score"] = df.apply(
    calculate_safety_score,
    axis=1
)

# ----------------------------
# SORT SAFEST ROUTES
# ----------------------------

result = df.sort_values(
    by="Safety_Score",
    ascending=False
)

# ----------------------------
# OUTPUT
# ----------------------------

print("\n========================================")
print("SAFE ROUTE INTELLIGENCE")
print("========================================\n")

print(
    "Recommended Safe Areas:\n"
)

for index, row in result.iterrows():

    print(
        f"{row['Area']}"
    )

    print(
        f"  Safety Score : {row['Safety_Score']}/100"
    )

    print(
        f"  CCTV Count   : {row['CCTV_Count']}"
    )

    print(
        f"  Lighting     : {row['Lighting']}"
    )

    print(
        f"  Patrol       : {row['Patrol']}"
    )

    print(
        f"  Incidents    : {row['Incidents']}"
    )

    print("----------------------------------")

# ----------------------------
# TOP SAFE AREA
# ----------------------------

best_area = result.iloc[0]

print("\nBEST SAFE ROUTE AREA\n")

print(
    f"Area : {best_area['Area']}"
)

print(
    f"Safety Score : {best_area['Safety_Score']}/100"
)

print("\n========================================")