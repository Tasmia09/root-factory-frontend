import React, { Component } from 'react';
import { connect } from 'react-redux';

class Factory extends Component {
    
    componentDidMount () {
        this.props.getFactories()
    }
    
    render(){
        console.log('factorues are ', this.props.factories)
        return (
            <div>Biday Pithibi</div>
        )
    }
}

function mapStateToProps ({ factoryReducer }) {
    return {
      factory: factoryReducer.factory,
      factories: factoryReducer.factories
    }
}

export default Factory;