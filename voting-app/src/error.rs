use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Not eligible to vote")]
    Unauthorized {},

    #[error("Invalid candidate")]
    InvalidCandidate {},

    #[error("Already voted")]
    AlreadyVoted {},

}
