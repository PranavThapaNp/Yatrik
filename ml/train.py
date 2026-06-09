import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

df = pd.read_csv("data/recommendation_dataset.csv")

X = df[["budget", "days", "season", "travel_style", "destination_type"]] #yo chei features/input
y = df["destination"] #target, features ko basis ma paune

#Non-numeric value lai encode garnu parxa
encoders = {}

for col in ["season", "travel_style", "destination_type"]:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    encoders[col] = le
    
#Destination lai encode gareko
target_encoder = LabelEncoder()
y = target_encoder.fit_transform(y)

#Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,y,
    test_size=0.2,
    random_state=42
)

#Train Random Forest
model = RandomForestClassifier(
    n_estimators= 100,
    random_state=42
)

model.fit(X_train, y_train)

#Evaluate model
y_pred = model.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nReport:\n", classification_report(y_test, y_pred))

#Save model + encoders
joblib.dump(model, "ml/recommender_model.pkl")
joblib.dump(encoders, "ml/feature_encoders.pkl")
joblib.dump(target_encoder, "ml/target_encoder.pkl")

print("\nModel saved successfully!")