import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';

class LoadingIndicator extends Component {
    constructor(props) {
        super(props);
        LoadingIndicator.propTypes = {
            type: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
        };
    }

    render() {
        return (
            <div>
                <ReactLoading type={this.props.type} color={this.props.color}/>
            </div>
        );
    }
}

export default LoadingIndicator;