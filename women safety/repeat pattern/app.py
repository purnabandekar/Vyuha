import pandas as pd

df = pd.read_csv(
    "repeat incident .csv"
)

# -------------------------
# TOTALS
# -------------------------

total_cases = df["Total_Cases"].sum()

repeat_cases = df["Repeat_Cases"].sum()

repeat_percentage = round(
    (repeat_cases / total_cases) * 100,
    1
)

# -------------------------
# PATTERN ANALYSIS
# -------------------------

same_location = round(
    (df["Same_Location"].sum() / repeat_cases) * 100,
    1
)

same_offender = round(
    (df["Same_Offender"].sum() / repeat_cases) * 100,
    1
)

same_time = round(
    (df["Same_Time_Range"].sum() / repeat_cases) * 100,
    1
)

same_modus = round(
    (df["Same_Modus_Operandi"].sum() / repeat_cases) * 100,
    1
)

# -------------------------
# HIGH REPEAT ZONES
# -------------------------

high_repeat_zones = len(
    df[df["Repeat_Cases"] >= 20]
)

# -------------------------
# OUTPUT
# -------------------------

print("\n==============================================")
print("REPEAT INCIDENT PATTERN ANALYSIS")
print("==============================================\n")

print(
    f"Crime Repeats In Same Zone : "
    f"{repeat_percentage}%"
)

print("\nPattern Breakdown\n")

print(
    f"Same Location       : "
    f"{same_location}%"
)

print(
    f"Same Offender       : "
    f"{same_offender}%"
)

print(
    f"Same Time Range     : "
    f"{same_time}%"
)

print(
    f"Same Modus Operandi : "
    f"{same_modus}%"
)

print("\n----------------------------------------------")

print(
    f"High Repeat Zones Identified : "
    f"{high_repeat_zones}"
)

print(
    "\nALERT : Repeat incident clusters detected."
)

print(
    "Recommended action : Increase patrol "
    "coverage and investigation focus."
)

print("\n==============================================")