import pandas as pd

# Load dataset
df = pd.read_csv("investigation success.csv")

# -----------------------------------
# Overall Success Rate
# -----------------------------------

overall_success = round(
    df["Success_Rate"].mean(),
    1
)

# -----------------------------------
# Best Performing Factor
# -----------------------------------

best_factor = df.sort_values(
    by="Success_Rate",
    ascending=False
).iloc[0]

# -----------------------------------
# OUTPUT
# -----------------------------------

print("\n========== INVESTIGATION SUCCESS INTELLIGENCE ==========\n")

print(f"Overall Success Rate : {overall_success}%\n")

print("Success Rate By Key Factors:\n")

for _, row in df.iterrows():

    print(
        f"{row['Factor']} : "
        f"{row['Success_Rate']}%"
    )

print("\n-------------------------------------------------------")

print(
    f"\nHighest Success Factor : "
    f"{best_factor['Factor']}"
)

print(
    f"Success Rate : "
    f"{best_factor['Success_Rate']}%"
)

print(
    f"\nKEY INSIGHT : Cases with "
    f"{best_factor['Factor']} "
    f"have {best_factor['Success_Rate']}% higher resolution rate."
)

print("\n=======================================================\n")