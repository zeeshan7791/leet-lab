import React, { useEffect } from 'react'
import CreateProblemForm from '../components/CreateProblemForm'
import { useProblemStore } from '../store/useProblemStore';
import { useParams } from 'react-router-dom';

const UpdateProblem = () => {


  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  useEffect(() => {
    if (id) getProblemById(id);
  }, [id]);

  return (
 <div>
      <CreateProblemForm
      problem={problem}
      
      />
    </div>
  )
}

export default UpdateProblem