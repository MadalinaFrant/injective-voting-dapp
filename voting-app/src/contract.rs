#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, GetCandidatesResponse, GetVotesResponse, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:voting-app";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        owner: info.sender.clone(),
        voters: Vec::new(),
        // Initialize the votes map with candidates
        votes: msg
            .candidates
            .iter()
            .map(|candidate| (candidate.clone(), 0))
            .collect(),
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Vote { candidate } => execute::vote(deps, info, candidate),
    }
}

pub mod execute {
    use super::*;

    pub fn vote(deps: DepsMut, info: MessageInfo, candidate: String) -> Result<Response, ContractError> {
        STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {

            // Check if the sender is eligible to vote (if they have a token named "eligible_to_vote")
            if !info.funds.iter().any(|coin| coin.denom == "eligible_to_vote") {
                return Err(ContractError::Unauthorized {});
            }

            // Check if the sender has already voted
            if state.voters.contains(&info.sender) {
                return Err(ContractError::AlreadyVoted {});
            }

            // Check if the candidate is valid
            if !state.votes.contains_key(&candidate) {
                return Err(ContractError::InvalidCandidate {});
            }

            // Increment the vote for the candidate
            let count = state.votes.get(&candidate).unwrap_or(&0) + 1;

            // Save the updated vote count
            state.votes.insert(candidate.clone(), count);

            // Mark the sender as having voted
            state.voters.push(info.sender.clone());

            Ok(state)
        })?;

        Ok(Response::new().add_attribute("action", "vote"))
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetVotes {} => to_json_binary(&query::get_votes(deps)?),
        QueryMsg::GetCandidates {} => to_json_binary(&query::get_candidates(deps)?),
    }
}

pub mod query {
    use super::*;

    pub fn get_votes(deps: Deps) -> StdResult<GetVotesResponse> {
        let state = STATE.load(deps.storage)?;
        Ok(GetVotesResponse { votes: state.votes })
    }

    pub fn get_candidates(deps: Deps) -> StdResult<GetCandidatesResponse> {
        let state = STATE.load(deps.storage)?;
        Ok(GetCandidatesResponse { candidates: state.votes.keys().cloned().collect() })
    }
}

