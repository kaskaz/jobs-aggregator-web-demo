import React, { useEffect, useState } from 'react';
import './App.css';

type Job = {
  id: string
  source: string,
  title: string
  location: string
  companyName: string
  postedAt: Date
  expiresAt: Date
  url: string
}

type JobDto = {
  id: string
  source: string
  title: string
  location: string
  company_name: string
  posted_at: string
  expires_at: string
  url: string
}

const getServiceUrl = () => {
  if(process.env.REACT_APP_SERVICE_URL) return process.env.REACT_APP_SERVICE_URL;
  else throw new Error('REACT_APP_SERVICE_URL is not defined!');
}

const getPollingTime = (): number => process.env.REACT_APP_POLLING_TIME ? Number(process.env.REACT_APP_POLLING_TIME) : 30;

const mapJobDtoToJob = (job: JobDto): Job => {
  return {
    id: job.id,
    source: job.source,
    title: job.title,
    location: job.location,
    companyName: job.company_name,
    postedAt: new Date(job.posted_at),
    expiresAt: new Date(job.expires_at),
    url: job.url
  }
}

const mergeJobs = (existing: Job[], toMerge: Job[]): Job[] => {
  let missingJobs = toMerge.filter(j => !existing.map(e => e.id).includes(j.id));
  return [...missingJobs, ...existing].sort((a, b) => a.id.localeCompare(b.id) > 0 ? -1 : 1);
}

const JobList = ({
  name,
  jobs
}: {
  name: string | React.ReactElement,
  jobs: Array<Job>
}) => {
  return (
    <div className='flex flex-col gap-2 max-h-[100%] overflow-hidden'>
      <div className='text-xl py-2'>{name}</div>
      <div className='flex flex-col gap-2 items-center h-[100%] overflow-y-auto py-4 border-2 rounded-md'>
        {jobs.map(job => <JobCard key={job.id} job={job}/>)}
      </div>
    </div>
  ); 
}

const JobCard = ({ job }: { job: Job }) => {
  return (
    <div className='shadow-lg rounded-md w-4/5 bg-zinc-300 select-none py-2'>
      <p>{job.title}</p>
      <p>{job.location}</p>
      <p>{job.companyName}</p>
      <p>from {job.postedAt.toDateString()} to {job.expiresAt.toDateString()}</p>
    </div>
  )
}

function App() {
  const [streamingJobs, setStreamingJobs] = useState<Array<Job>>([]);
  const [pollingJobs, setPollingJobs] = useState<Array<Job>>([]);
  const [pollingTime, setPollingTime] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      if(pollingTime === 0) {
        fetch(`${getServiceUrl()}/rest/jobs`)
        .then(res => res.json())
        .then(data => setPollingJobs(jobs => mergeJobs(jobs, (data as Array<JobDto>).map(mapJobDtoToJob))))
        .catch(err => console.error('Failed to fetch jobs from /rest/jobs', err))
        .finally(() => setPollingTime(getPollingTime()));
      } else setPollingTime(pollingTime-1);
    }, 1000);
  }, [pollingTime]);

  useEffect(() => {
    console.log('Setting up job streaming')
    const jobsStreaming = new EventSource(`${getServiceUrl()}/stream/jobs`);

    jobsStreaming.onmessage = function(event) {
      setStreamingJobs(jobs => mergeJobs(jobs, [mapJobDtoToJob(JSON.parse(event.data) as JobDto)]));
    }
  
    jobsStreaming.onerror = function(event) {
      console.error('Failed to read from /stream/jobs', event);
      jobsStreaming.close();
    }

    return () =>  {
      console.log('Closing job streaming')
      jobsStreaming.close();
    }
  }, []);

  const pollingTitle = () => {
    return (
      <div>
        Polling&nbsp;
        <label className='rounded-full border-2 border-slate-300 px-2 text-xs'>
          next in {pollingTime > 9 ? pollingTime : `0${pollingTime}`}
        </label>
      </div>
    )
  }
  
  return (
    <div className='container mx-auto flex flex-col h-full lg:w-5/6 text-center'>
      <header className='h-[6vh] leading-[6vh] text-2xl'>Jobs aggregator</header>
      <main className='h-[88vh] grid gap-4 grid-cols-2'>
        <JobList name={pollingTitle()} jobs={pollingJobs}/>
        <JobList name='Realtime' jobs={streamingJobs}/>
      </main>
      <footer className='h-[6vh] leading-[6vh] text-sm select-none'>
        Made by <a className='underline' href="https://kaskaz.github.io/">Nuno Cascalho</a>
      </footer>
    </div>
  );
}

export default App;

