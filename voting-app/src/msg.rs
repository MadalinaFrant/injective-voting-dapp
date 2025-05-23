use cosmwasm_schema::{cw_serde, QueryResponses};

use std::collections::HashMap;

#[cw_serde]
pub struct InstantiateMsg {
    pub candidates: Vec<String>,
}

#[cw_serde]
pub enum ExecuteMsg {
    Vote { candidate: String },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetVotes returns the current votes
    #[returns(GetVotesResponse)]
    GetVotes {},

    // GetCandidates returns the list of candidates
    #[returns(GetCandidatesResponse)]
    GetCandidates {},
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetVotesResponse {
    pub votes: HashMap<String, u32>,
}

#[cw_serde]
pub struct GetCandidatesResponse {
    pub candidates: Vec<String>,
}

