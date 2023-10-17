import { useState } from 'react';
import './App.css';

type Job = {
  id: string
  title: string
  location: string
  contractType: string
  compensationMin: number | null
  compensationMax: number | null
  compensationCurrency: String
}

const JOBS = [
  {
    id: '1',
    title: 'Software Engineer',
    location: 'Lisbon, Portugal',
    contractType: 'fulltime',
    compensationMin: null,
    compensationMax: 60000,
    compensationCurrency: '$'
  },
  {
    id: '2',
    title: 'Engineer Manager',
    location: 'Lisbon, Portugal',
    contractType: 'fulltime',
    compensationMin: null,
    compensationMax: 60000,
    compensationCurrency: '$'
  },
  {
    id: '3',
    title: 'Engineer Manager',
    location: 'Lisbon, Portugal',
    contractType: 'fulltime',
    compensationMin: null,
    compensationMax: 60000,
    compensationCurrency: '$'
  },
  {
    id: '4',
    title: 'Engineer Manager',
    location: 'Lisbon, Portugal',
    contractType: 'fulltime',
    compensationMin: null,
    compensationMax: 60000,
    compensationCurrency: '$'
  },
  {
    id: '5',
    title: 'Engineer Manager',
    location: 'Lisbon, Portugal',
    contractType: 'fulltime',
    compensationMin: null,
    compensationMax: 60000,
    compensationCurrency: '$'
  },
  {
    id: '6',
    title: 'Engineer Manager',
    location: 'Lisbon, Portugal',
    contractType: 'fulltime',
    compensationMin: null,
    compensationMax: 60000,
    compensationCurrency: '$'
  }
];

const JobList = ({
  name,
  jobs
}: {
  name: string,
  jobs: Array<Job>
}) => {
  return (
    <div className='flex flex-col gap-2 max-h-[100%] overflow-hidden'>
      <p className='text-xl'>{name}</p>
      <div className='flex flex-col gap-2 items-center h-[100%] overflow-y-auto py-4 border-2 rounded-md'>
        {jobs.map(job => <JobCard job={job}/>)}
      </div>
    </div>
  ); 
}

const JobCard = ({ job }: { job: Job }) => {
  const cMin = job.compensationMin ? `${job.compensationMin}${job.compensationCurrency}` : '?';
  const cMax = job.compensationMax ? `${job.compensationMax}${job.compensationCurrency}` : '?';

  return (
    <div key={job.id} className='shadow-lg rounded-md w-4/5 bg-zinc-300 select-none py-2'>
      <p>{job.title}</p>
      <p>{job.location}</p>
      <p>{job.contractType}</p>
      <p>{cMin} - {cMax}</p>
    </div>
  )
}

function App() {
  const [pollingJobs, setPollingJobs] = useState<Array<Job>>(JOBS);
  
  return (
    <div className='container mx-auto flex flex-col h-full lg:w-5/6 text-center'>
      <header className='h-[6vh] leading-[6vh] text-2xl'>Jobs aggregator</header>
      <main className='h-[88vh] grid gap-4 grid-cols-2'>
        <JobList name='Polling' jobs={pollingJobs}/>
        <JobList name='Realtime' jobs={[]}/>
      </main>
      <footer className='h-[6vh] leading-[6vh] text-sm select-none'>
        Made by <a className='underline' href="https://kaskaz.github.io/">Nuno Cascalho</a>
      </footer>
    </div>
  );
}

export default App;

