import React, { useState, useEffect } from 'react';
import Context from './Context';
import axios from 'axios';
import { message } from 'antd';

import socket from './io';

const Provider = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getPolls();
    socket.on("update:server", () => {
      getPolls();
    });
  }, []);


  const getPolls = (callback) => {
    axios.get('/api/polls')
      .then(res => {
        setIsLoading(false);
        setPolls(res.data);
        callback && callback();
      })
      .catch(err => {
        console.log(err)
        message.error('Something went wrong when fetching the polls', 3)      
      });
  }

  const addVote = (id, value, callback) => {
    // eslint-disable-next-line 
    axios.patch(`/api/polls/cast/${id}`, { vote_id: value })
      .then(res => {
        callback();
        getPolls();
        message.success('Thanks for voting!', 3)
      })
      .catch(err => {
        console.log('ERROR Updating Poll', err);
        message.error('Something went wrong when voting', 3);
      });
  }

  const createPoll = (data, callback, err) => {
    axios.post('/api/polls', data)
      .then(data => {
        getPolls(callback);
      })
      .catch((error) => {
        err && err(error);
      });
  }

  const handleDeletePoll = (_id) => {
    // eslint-disable-next-line 
    axios.delete(`/api/polls/${_id}`, { data: { poll_id: _id } })
      .then(() => {
        getPolls();
        message.success('Poll has been deleted!', 3)
        socket.emit('update:client', true);
      })
      .catch(err => {
        console.log(err);
        message.error('Something went wrong when deleting the poll', 3)
      });
  }

  return (
    <Context.Provider
      value={{
        polls: polls,
        isLoading: isLoading,
        getPolls: getPolls,
        handleDeletePoll: handleDeletePoll,
        addVote: addVote,
        createPoll: createPoll
      }}>
      {props.children}
    </Context.Provider>
  )
}

export default Provider;