import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  VirtualizedScrollView,
  VirtualizedView,
} from '../src';

const { width, height } = Dimensions.get('window');
const array = Array(100).fill(0);
const rowHeight = 100;
const imageWidth = 0.8 * width;
const restWidth = width - imageWidth;

const Row = (props) => {
  const { index } = props;
  const uri = `https://5b0988e595225.cdn.sohucs.com/images/20180911/72d7781b49cc4a84935b381105b5a842.jpeg?index=${index}`;
  return (
    <VirtualizedView
      index={index}
      style={styles.row}
    >
      <View
        style={styles.index}
      >
        <Text>
          {index}
        </Text>
      </View>
      <Image
        style={styles.image}
        source={{ uri }}
      />
    </VirtualizedView>
  );
};

Row.propTypes = {
  index: PropTypes.number.isRequired,
};

const App = () => {
  console.log('App');
  return (
    <View style={styles.container}>
      <VirtualizedScrollView
        style={{
          width,
          height,
        }}
      >
        <View>
          <View>
            {
              array.map((_, index) => (
                <Row
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  index={index}
                />
              ))
            }
          </View>
        </View>
      </VirtualizedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    height: rowHeight,
    width,
  },
  index: {
    height: rowHeight,
    width: restWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: rowHeight,
    width: imageWidth,
  },
});

export default App;
