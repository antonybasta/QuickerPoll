import React, { useState, useContext } from 'react';
import { Modal, Button, Radio } from 'antd';
import PropTypes from 'prop-types';
import Context from './Context';
import io from 'socket.io-client';

const RadioGroup = Radio.Group

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px'
}

function CastVote(props) {
  const context = useContext(Context);
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(null);

  const showModal = () => {
    setVisible(true);
  }

  const reset = () => {
    setLoading(false);
    setValue(null);
  }

  const handleOk = () => {
    setLoading(true);
    context.state.addVote(props.poll._id, value, () => {
      setVisible(false);
      reset();
    });
    const socket = io();
    socket.emit('update:client', true);
    // this.props.updatePoll(result.data.votes);
  }


  const handleCancel = e => {
    setVisible(false);
  }

  const onChange = e => {
    console.log('radio checked', e.target.value)
    setValue(e.target.value);
  }
  return (
    <div>
      <Button icon="pie-chart" onClick={showModal} />
      <Modal
        title="Cast Vote"
        confirmLoading={isLoading}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <h2>Vote for "{props.poll.name}"</h2>

        <RadioGroup onChange={onChange} value={value}>
          {props.poll.votes.map(item => {
            return (
              <Radio style={radioStyle} key={item._id} value={item._id}>
                {item.name}
              </Radio>
            )
          })}
        </RadioGroup>
      </Modal>
    </div>
  )
}

CastVote.propTypes = {
  poll: PropTypes.shape({
    _id: PropTypes.string,
    votes: PropTypes.array,
    name: PropTypes.string
  }).isRequired
}
export default CastVote
