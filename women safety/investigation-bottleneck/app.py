from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI(
    title="Investigation Bottleneck Intelligence API"
)

# CORS for frontend + Render

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load dataset

df = pd.read_csv("data/bottle.csv")


# Risk Classification

def bottleneck_level(days):

    if days < 2:
        return "Low"

    elif days < 6:
        return "Medium"

    elif days < 10:
        return "High"

    else:
        return "Critical"


df["Bottleneck_Level"] = df["Avg_Delay_Days"].apply(
    bottleneck_level
)


@app.get("/")
def home():

    return {
        "message":
        "Investigation Bottleneck API Running"
    }


@app.get("/investigation-bottleneck")
def investigation_bottleneck():

    return df.to_dict(orient="records")


@app.get("/major-bottleneck")
def major_bottleneck():

    row = df.sort_values(
        by="Avg_Delay_Days",
        ascending=False
    ).iloc[0]

    return {
        "stage": row["Stage"],
        "delay_days": row["Avg_Delay_Days"],
        "level": row["Bottleneck_Level"],
        "focus_area":
        "Investigation Follow-up & Resource Allocation"
    }