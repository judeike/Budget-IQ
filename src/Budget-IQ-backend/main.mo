import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Blob "mo:base/Blob";
import HashMap "mo:base/HashMap";
import Cycles "mo:base/ExperimentalCycles";
import Types "Types";
import Array "mo:base/Array";
import Serde "mo:serde";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
// import Map "mo:map/Map";


actor BudgetIQ {
// Define types for budget plan and user budget
public type BudgetPlan = {
    purpose: Text;             // Purpose of the budget
    timeframe: Text;           // Timeframe for the budget
    totalAmount: Nat;          // Total amount of money allocated
    totalIncomeMonthly: Nat;   // Total income per month
    totalExpensesMonthly: Nat; // Total expenses per month
    user_principal : Principal;
};

public type AIResponse = {
    expectedBudget: Text;
    timeFrame: Text;
    suggestedInvestments: Text;
    suggestedPlansForSavings: Text;
    suggestedAmountToSavePerIncome: Text; 
};

public type Error_Message ={
    #error: Text;
    #message : Text ;
};

public type User = {
  name : Text
};


// Initialize a HashMap for storing user budgets and AI responses
var ai_budget_response : HashMap.HashMap<Principal, [AIResponse]> = HashMap.HashMap<Principal, [AIResponse]>(0, Principal.equal, Principal.hash);
var userBudgetsWithAI: HashMap.HashMap<Principal, [BudgetPlan]> = HashMap.HashMap<Principal, [BudgetPlan]>(0, Principal.equal, Principal.hash);
var maxUsers : Nat = 20;
// var userData: HashMap.HashMap<Principal, User> = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);

public func userPrincipal(principalId: Text): async ?([BudgetPlan], [AIResponse]) {
    let principal = Principal.fromText(principalId);

    // Check if the principal already exists in `storedPrincipals`
    let budget_plans = switch (userBudgetsWithAI.get(principal)) {
        case (?plans) {
            // Principal already exists, retrieve their MealRequest data
            Debug.print("Principal already exists: " # Principal.toText(principal));
            plans;
        };
        case (null) {
            // Check if the maximum number of users has been reached
            if (userBudgetsWithAI.size() >= maxUsers) {
                Debug.print("Maximum number of users reached for beta.");
                return null; // Reject the addition of a new principal
            };

            // Principal doesn't exist, add them to the HashMap with an empty array of MealRequests
            userBudgetsWithAI.put(principal, []);
            Debug.print("New principal added: " # Principal.toText(principal));
            [];
        };
    };

    // Check if the principal has any MealPlans in `mealGeneration`
    let budgetPlans = switch (ai_budget_response.get(principal)) {
        case (?plans) {
            // Retrieve the existing MealPlan data
            plans;
        };
        case (null) {
            // No MealPlans found, return an empty array
            [];
        };
    };

    // Return both MealRequest and MealPlan arrays as a tuple
    return ?(budget_plans, budgetPlans);
};

// Function to create or update a budget plan with AI recommendations
public func createOrUpdateBudgetPlan(
    principalId: Text,
    purpose: Text,
    timeframe: Text,
    totalAmount: Nat,
    totalIncomeMonthly: Nat,
    totalExpensesMonthly: Nat
    ) : async ?AIResponse {
    let principal = Principal.fromText(principalId);

                if (totalAmount < 0) {
                    throw Error.reject ("Error: Total amount must be non-negative.");
                };
                if (totalIncomeMonthly < 0) {
                    throw Error.reject ("Error: Total monthly income must be non-negative.");
                };
                if (totalExpensesMonthly < 0) {
                    throw Error.reject ("Error: Total monthly expenses must be non-negative.");
                };
                if (timeframe == "") {
                    throw Error.reject ("Error: Timeframe cannot be empty.");
                };
    switch (userBudgetsWithAI.get(principal)){
        case(?myBudget){
            let availble_budget = Array.find(myBudget, func(plan: BudgetPlan): Bool { plan.purpose == purpose });
            switch (availble_budget) {
                    case (?_) {
                    // Budget with the same purpose already exists, deny update
                    throw Error.reject ("Error: A budget with this purpose already exists. Updating is not allowed.");
                    };
                    case (null) {
                        let newBudgetPlan: BudgetPlan = {
                        user_principal = principal;
                        purpose = purpose;
                        timeframe = timeframe;
                        totalAmount = totalAmount;
                        totalIncomeMonthly = totalIncomeMonthly;
                        totalExpensesMonthly = totalExpensesMonthly;
                        };

                        userBudgetsWithAI.put(principal, Array.append(myBudget, [newBudgetPlan]));
                        // Prepare request body for AI service
                        let request_body_json = "{ \"purpose\" : \"" # purpose # "\", \"timeframe\" : \"" # timeframe # "\", \"total_amount\" : " # Nat.toText(totalAmount) # ", \"total_income_monthly\" : " # Nat.toText(totalIncomeMonthly) # ", \"total_expenses_monthly\" : " # Nat.toText(totalExpensesMonthly) # " }";

                        // Call AI service to get recommendations
                        let endpoint = "budget-plan";
                        let response = await send_http_post_request(request_body_json, endpoint);
                        switch (Serde.JSON.fromText(response, null)) {
                            case (#err(error)) {
                                throw Error.reject("Error in creating Meal Plan");
                            };
                            case (#ok(blob)) {
                                let aibudget: ?AIResponse = from_candid(blob);
                                switch (aibudget){
                                    case(?budgets){
                                        let existing_Budget_Plans = switch (ai_budget_response.get(principal)) {
                                        case (?mybudgets) { mybudgets };
                                        case (null) { [] };
                                        };
                                        ai_budget_response.put(principal, Array.append(existing_Budget_Plans, [budgets]));
                                        return aibudget;
                                    };
                                    case (_) {
                                        throw Error.reject("AI response was not a valid MealPlan");
                                    };
                                };
                            };
                        };
                    };
                };
        };
        case(null){
            let newBudgetPlan: BudgetPlan = {
            user_principal = principal;
            purpose = purpose;
            timeframe = timeframe;
            totalAmount = totalAmount;
            totalIncomeMonthly = totalIncomeMonthly;
            totalExpensesMonthly = totalExpensesMonthly;
            };

            // Prepare request body for AI service
            let request_body_json = "{ \"purpose\" : \"" # purpose # "\", \"timeframe\" : \"" # timeframe # "\", \"total_amount\" : " # Nat.toText(totalAmount) # ", \"total_income_monthly\" : " # Nat.toText(totalIncomeMonthly) # ", \"total_expenses_monthly\" : " # Nat.toText(totalExpensesMonthly) # " }";

            // Call AI service to get recommendations
            let endpoint = "budget-plan";
            let response = await send_http_post_request(request_body_json, endpoint);

            switch (Serde.JSON.fromText(response, null)) {
                case (#err(error)) {
                    throw Error.reject("Error in creating Meal Plan");
                };
                 case (#ok(blob)) {
                    let aibudget: ?AIResponse = from_candid(blob);
                    switch (aibudget){
                        case (?budgets) {
                            userBudgetsWithAI.put(principal, [newBudgetPlan]);
                            ai_budget_response.put(principal, [budgets]);
                            return aibudget;
                        };
                        case (_) {
                            throw Error.reject("AI response was not a valid BudgetPlan");
                        };
                     };
                };
            };
        };
    };
};

public func getAllBudgets(principalId: Text) : async ?[BudgetPlan] {
    let principal = Principal.fromText(principalId);

    // Check if the user has any budget plans
    switch (userBudgetsWithAI.get(principal)) {
        case (?myBudgets) {
            // User has budget plans, return them
            return ?myBudgets;
        };
        case (null) {
            // No budget plans found for the user
            return null;
        };
    };
};

// Function to get all AI responses for a specific user
public func getAllAIResponses(principalId: Text) : async ?[AIResponse] {
    let principal = Principal.fromText(principalId);

    // Retrieve AI responses for the given principal
    switch (ai_budget_response.get(principal)) {
        case (?responses) {
            // Return the list of AI responses
            return ?responses;
        };
        case (null) {
            // No AI responses found for this user
            return null;
        };
    };
};

    // //delete a plan 
    public func deleteMealPlan(principalId: Text, planId: Nat) : async Error_Message {
      let principal = Principal.fromText(principalId);
      switch (userBudgetsWithAI.get(principal)) {
        case (?plans) {
          if(planId < plans.size()){
            let plansList = List.fromArray(plans);
            let plan = plans[planId];
            //does the principal owns the plan?
            if (plan.user_principal == principal){
              let listFront = List.take(plansList, planId); 
              let listBack = List.drop(plansList, planId + 1);
              let newPlans = List.toArray(List.append(listFront, listBack));
              userBudgetsWithAI.put(principal, newPlans);
              return #message ("Plan Deleted")
            }else{
              return #message ("You do not own this Plan");
            }
          }else{
            return #message ("Plan not found"); 
          }
        };
        case (_) {
          return #message ("User not found");
        };
      };
    };


public query func transform(raw : Types.TransformArgs) : async Types.CanisterHttpResponsePayload {
    let transformed : Types.CanisterHttpResponsePayload = {
          status = raw.response.status;
          body = raw.response.body;
          headers = [
              {
                  name = "Content-Security-Policy";
                  value = "default-src 'self'";
              },
              { name = "Referrer-Policy"; value = "strict-origin" },
              { name = "Permissions-Policy"; value = "geolocation=(self)" },
              {
                  name = "Strict-Transport-Security";
                  value = "max-age=63072000";
              },
              { name = "X-Frame-Options"; value = "DENY" },
              { name = "X-Content-Type-Options"; value = "nosniff" },
          ];
      };
      transformed;
  };

  func send_http_post_request(request_body_json: Text, endpoint: Text) : async Text {

    let ic : Types.IC = actor ("aaaaa-aa");

    let host : Text = "icp-api-budget.fly.dev";
    let url = "https://icp-api-budget.fly.dev/" # endpoint;

    let idempotency_key: Text = generateUUID();
    let request_headers = [
        { name = "Host"; value = host },
        { name = "User-Agent"; value = "http_post_sample" },
        { name= "Content-Type"; value = "application/json" },
        { name= "Idempotency-Key"; value = idempotency_key }
    ];

    let request_body_as_Blob: Blob = Text.encodeUtf8(request_body_json);
    let request_body_as_nat8: [Nat8] = Blob.toArray(request_body_as_Blob); // e.g [34, 34,12, 0]

    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    let http_request : Types.HttpRequestArgs = {
        url = url;
        max_response_bytes = null; //optional for request
        headers = request_headers;
        //note: type of `body` is ?[Nat8] so you pass it here as "?request_body_as_nat8" instead of "request_body_as_nat8"
        body = ?request_body_as_nat8;
        method = #post;
        transform = ?transform_context;
    };

    Cycles.add(21_850_258_000);

    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    let response_body: Blob = Blob.fromArray(http_response.body);
    let decoded_text: Text = switch (Text.decodeUtf8(response_body)) {
        case (null) { "No value returned" };
        case (?y) { y };
    };

    // Finally, you can return the response of the body.
    let result: Text = decoded_text;
    result
  };

  func generateUUID() : Text {
    "UUID-123456789";
  };
}
