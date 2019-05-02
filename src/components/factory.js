import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, notification, Modal, Input, Button, Tree } from 'antd';
import { getFactories, createFactory, getFactoryById, updateFactory, deleteFactory } from '../actions/factoryAction';
import './factory.css';

const FormItem = Form.Item;
const { TreeNode } = Tree;

class Factory extends Component {
  state = {
      showCreateModal: false,
      showUpdateModal: false,
      disableCreationButton: true,
      selectedFactoryId: ''
  }

  componentDidMount () {
    this.props.getFactories()
  }

  renderFactoryNumbers = (children) => {
    const factoryNumberList = children.map((child, index) => <TreeNode title={child} key={index} selectable={false}/>)
    return factoryNumberList
  }

  renderFactoryItems = () => {
    const { factories } = this.props;
    const factoryNameList = factories.map(factory => <TreeNode title={factory.name} key={factory._id}>{this.renderFactoryNumbers(factory.children)}</TreeNode>)
    
    return(
       <div>
            <Tree defaultExpandAll={true} onSelect={this.handleNodeClick}>
                <TreeNode title="Root" key="0-0" selectable={false}>
                    {factoryNameList}
                </TreeNode>
            </Tree>
       </div>
    )    
  }

  handleNodeClick = (selectedKeys) => {
      const {selectedFactoryId} = this.state
      console.log('selectedKeys: ', selectedKeys, ' and this.state.selectedFactoryId: ', selectedFactoryId)
      const id = selectedKeys.length === 0 ? selectedFactoryId : selectedKeys[0]
      console.log('id is: ', id)
      this.setState({selectedFactoryId: id}, () => {
        this.props.getFactoryById(this.state.selectedFactoryId)
        this.toggleEditModal()
      })
  }

  renderCreateModal = () => {
    const { showCreateModal } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;  
    return(
        <Modal
            title={`Create a Factory`}
            visible={showCreateModal}
            onOk={ this.onSubmitCreate }
            onCancel={ this.toggleCreateModal }
        >
        <FormItem label="Factory Name">
            {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Factory name is required' }],
            })(
                <Input type='text' placeholder='Name' />
            )}
        </FormItem>
        <FormItem label="Number of Children">
            {getFieldDecorator('num_children', {
                rules: [{ required: true, message: 'Number of children is required' }],
            })(
                <Input type='text' placeholder='up to 15' />
            )}
        </FormItem>
        <FormItem label="Upper Limit">
            {getFieldDecorator('upper_limit', {
                rules: [{ required: true, message: 'Upper limit is required' }],
            })(
                <Input type='text' placeholder='upper limit' />
            )}
        </FormItem>
        <FormItem label="Lower Limit">
            {getFieldDecorator('lower_limit', {
                rules: [{ required: true, message: 'Lower limit is required' }],
            })(
                <Input type='text' placeholder='lower limit' />
            )}
        </FormItem>
      </Modal>
    )
  }

  toggleCreateModal = () => {
    this.props.form.resetFields()
    this.setState({ showCreateModal: !this.state.showCreateModal })
  }

  renderEditModal = () => {
    const { showUpdateModal } = this.state;
    const { form, factory } = this.props;
    const { getFieldDecorator } = form;
    return(
        <Modal
            title={`Edit a Factory`}
            visible={showUpdateModal}
            footer={[
                <Button key="delete" type="warning" onClick={this.handleDeleteFactory}>Delete</Button>,
                <Button key="update" type="primary" onClick={this.onSubmitUpdate}>Update</Button>,
                <Button key="cancel" type="warning" onClick={this.toggleEditModal}>Cancel</Button>
            ]}
            // onOk={ this.onSubmitUpdate }
            onCancel={ this.toggleEditModal }
        >
        <FormItem label="New Factory Name">
            {getFieldDecorator('updated_name', {
                initialValue: factory.name,
                rules: [{ required: true, message: 'Factory name is required!' }],
            })(
                <Input type='text' placeholder='Name' />
            )}
        </FormItem>
        <FormItem label="Number of Children">
            {getFieldDecorator('updated_num_children', {
                initialValue: factory.num_children,
                rules: [{ required: true, message: 'Number of children is required!' }],
            })(
                <Input type='text' placeholder='up to 15' />
            )}
        </FormItem>
        <FormItem label="Upper Limit">
            {getFieldDecorator('updated_upper_limit', {
                initialValue: factory.upper_limit,
                rules: [{ required: true, message: 'Upper limit is required!' }],
            })(
                <Input type='text' placeholder='upper limit' />
            )}
        </FormItem>
        <FormItem label="Lower Limit">
            {getFieldDecorator('updated_lower_limit', {
                initialValue: factory.lower_limit,
                rules: [{ required: true, message: 'Lower limit is required!' }],
            })(
                <Input type='text' placeholder='lower limit' />
            )}
        </FormItem>
      </Modal>
    )
  }

  toggleEditModal = () => {
    this.props.form.resetFields()
    this.setState({ showUpdateModal: !this.state.showUpdateModal })
}

handleDeleteFactory = () => {
    console.log('deleting: ', this.state.selectedFactoryId)
    this.props.deleteFactory(this.state.selectedFactoryId)
    this.toggleEditModal()
}

  onSubmitCreate = (e) => {
      e.preventDefault()
      this.props.form.validateFields(['name', 'num_children', 'upper_limit', 'lower_limit'], async(err, values) => {
          if(!err) {
            if(values.num_children > 15 || Number(values.upper_limit) < Number(values.lower_limit)) {
                notification.error({
                    message: "Invalid input!"
                })
            }
            else {
                const { name, num_children, upper_limit, lower_limit } = values
                const children = await this.calculateFactory(num_children, upper_limit, lower_limit)
                this.props.createFactory({name, children, num_children, upper_limit, lower_limit  })
                this.toggleCreateModal()
            }
          }
      })
  }

  onSubmitUpdate = () => {
    this.props.form.validateFields(['updated_name', 'updated_num_children', 'updated_upper_limit', 'updated_lower_limit'], async(err, values) => {
        if(!err) {
            if(values.num_children > 15 || Number(values.updated_upper_limit) < Number(values.updated_lower_limit)) {
                notification.error({
                    message: "Invalid Input!"
                })
            } else {
                const { factory } = this.props
                let children = []
                const { updated_name, updated_num_children, updated_upper_limit, updated_lower_limit } = values
                if(factory.upper_limit === updated_upper_limit && factory.lower_limit === updated_lower_limit && factory.num_children === updated_num_children) {
                    children = factory.children
                } else {
                    children = await this.calculateFactory(updated_num_children, updated_upper_limit, updated_lower_limit)
                }
                const body = { name: updated_name, children, num_children: updated_num_children, upper_limit: updated_upper_limit, lower_limit: updated_lower_limit  }
                this.props.updateFactory(this.props.factory._id, body)
                this.toggleEditModal()
            }
        }
    })
  }

  calculateFactory = (num_children, upper_limit, lower_limit) => {
    const min = Math.ceil(lower_limit)
    const max = Math.floor(upper_limit)
    const numbersArray = []
    for(let i = 0; i<num_children; i++) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        numbersArray.push(randomNumber)
    }
    return numbersArray;
  }

  render () {
    const { factories } = this.props
    return (
        <div className="root-container">
            <Button className="create-modal-btn"  onClick={ this.toggleCreateModal }>
                Create a New Factory
            </Button>
            {factories.length === 0 && "No factories created yet"}
            { this.renderCreateModal() }
            { this.renderFactoryItems() }
            { this.renderEditModal() }
        </div>
    )
  }
}

const wrapFactoryForm = Form.create({})(Factory);

function mapStateToProps ({ factoryReducer }) {
  return {
    factory: factoryReducer.factory,
    factories: factoryReducer.factories
  }
}

export default connect(mapStateToProps, { getFactories, createFactory, getFactoryById, updateFactory, deleteFactory })(wrapFactoryForm);