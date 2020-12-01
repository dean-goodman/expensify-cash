import React, {Component} from 'react';
import {Image} from 'react-native';

class ThumbnailImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            thumbnailWidth: 200,
            thumbnailHeight: 200,
        };

        this.isComponentMounted = false;
    }

    componentDidMount() {
        // If the component unmounts by the time getSize() is finished, it will throw a warning
        // So this is to prevent setting state if the component isn't mounted
        this.isComponentMounted = true;

        // Scale image for thumbnail preview
        Image.getSize(this.props.previewSourceURL, (width, height) => {
            // Width of the thumbnail works better as a constant than it does
            // a percentage of the screen width since it is relative to each screen
            const thumbnailScreenWidth = 250;
            const scaleFactor = width / thumbnailScreenWidth;
            const imageHeight = height / scaleFactor;

            if (this.isComponentMounted) {
                this.setState({thumbnailWidth: thumbnailScreenWidth, thumbnailHeight: imageHeight});
            }
        });
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    render() {
        return (
            <Image
                style={{
                    ...this.props.style,
                    width: this.state.thumbnailWidth,
                    height: this.state.thumbnailHeight,
                }}
                source={{uri: this.props.previewSourceURL}}
            />
        );
    }
}

export default ThumbnailImage;
