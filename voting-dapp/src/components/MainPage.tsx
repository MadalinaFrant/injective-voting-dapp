import React, { useEffect} from "react";
import Button from "./App/Button";
import WalletConnect from "./App/WalletConnect";
import { useVotesStore } from "../store/votes";

type Props = {};

const MainPage = (props: Props) => {

  const { votes, candidates, fetchVotes, fetchCandidates, addVote } = useVotesStore();

  function castVote(candidate: string) {
    addVote(candidate);
    fetchVotes();
  }

  function renderCandidates() {
    return candidates.map((candidate) => (
      <div key={candidate} className='flex items-center justify-between w-1/2 p-4'>
        <p className='text-xl'>{candidate}</p>
        <Button onClick={() => castVote(candidate)}>
          Vote
        </Button>
      </div>
    ));
  }

  function renderVotes() {
    return Object.entries(votes).map(([candidate, voteCount]) => (
      <div key={candidate} className='flex items-center justify-between w-1/2 p-4'>
        <p className='text-xl mr-4'>{candidate}:</p>
        <p className='text-xl'>{voteCount}</p>
      </div>
    ));
  }

  useEffect(() => {
    fetchVotes();
    fetchCandidates();
  }
  , []);

  return (
    <div>
      <div className='absolute inset-x-0 flex justify-end p-4'>
        <WalletConnect />
      </div>
      <main className='min-h-screen grid place-items-center'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">

          {/* Voting */}
          <div className='flex flex-col items-center'>
            <p className='text-2xl'>Vote for your preferred candidate</p>
            <div className='flex flex-col items-center w-full'>
              {renderCandidates()}
            </div>
          </div>        

          {/* Votes */}
          <div className='flex flex-col items-center'>
            <p className='text-2xl'>Live Results</p>
            {renderVotes()}
          </div>

        </div>
      </main>
    </div>
  );
};

export default MainPage;
