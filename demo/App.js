import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  findNodeHandle,
  Button,
  FlatList
} from 'react-native';
import PropTypes from 'prop-types';
import {
  VirtualizedScrollView,
  VirtualizedView,
} from '../src';

const { width, height } = Dimensions.get('window');
const array = Array(1500).fill(0);
const rowHeight = 100;
const imageSize = 0.6 * rowHeight;
const margin = (rowHeight - imageSize) / 2;

const Placeholder = () => (
  <View style={styles.row}>
    <View style={styles.imageContainer}>
      <View style={styles.imagePlaceholder} />
    </View>
    <View style={styles.textContainer}>
      <View style={styles.titlePlaceholder} />
      <View style={styles.subtitlePlaceholder} />
    </View>
  </View>
);

const Row = (props) => {
  const { index } = props;
  // const uri = `https://5b0988e595225.cdn.sohucs.com/images/20180911/72d7781b49cc4a84935b381105b5a842.jpeg?index=${index}`;
  const uri = `https://picsum.photos/300/300?index=${index}`;
  const placeholder = useRef(<Placeholder />);

  return (
    <VirtualizedView
      index={index}
      style={styles.row}
      placeholder={placeholder.current}
      // layout={{
      //   width,
      //   height: rowHeight,
      //   offset: rowHeight * index,
      // }}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri }}
        />
        <View style={styles.imageCover}>
          <Text style={styles.index}>
            { index + 1 }
          </Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Lorem ipsum
        </Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      </View>
    </VirtualizedView>
  );
};

Row.propTypes = {
  index: PropTypes.number.isRequired,
};

const App = () => {
  console.log('App');
  // const scrollView = useRef(null);
  // const viewRef = useRef(null);
  // useEffect(() => {
  //   setInterval(() => {
  //     const scrollViewNode = findNodeHandle(scrollView.current);
  //     viewRef.current.measureLayout(
  //       scrollViewNode,
  //       (x, y, width, height) => {
  //         console.log('x', x);
  //         console.log('y', y);
  //         console.log('width', width);
  //         console.log('height', height);
  //         console.log('----');
  //       },
  //     );
  //   }, 300);
  // }, []);
  const [show, setShow] = useState(false);
  console.log('show', show);

  const [viewportBuffer, setViewportBuffer] = useState(0);
  const [horizontal, setHorizontal] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     // console.log('viewportbuffer changed to 500');
  //     // setViewportBuffer(500);
  //     console.log('horizontal changed');
  //     setHorizontal(true);
  //   }, 3000);
  // }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          width,
          height,
        }}
      >
        {/* <FlatList
          data={array}
          renderItem={({ item, index }) => (
            <Row
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              index={index}
            />
          )}
        /> */}
        <VirtualizedScrollView
          viewportBuffer={viewportBuffer}
          horizontal={horizontal}
          // style={{
          //   width,
          //   height,
          // }}
        >
          {
            // show && <View style={{ backgroundColor: 'gray', height: 500, width }} />
          }
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
          {/* <Button
            title="-1 row"
            onPress={() => {
              setShow(!show);
            }}
          /> */}
        </VirtualizedScrollView>
      </View>
      {/* <ScrollView contentOffset={{ x: 0, y: 200 }} ref={scrollView}>
        <View style={{ width: 100, height: 500, backgroundColor: 'pink' }} />
        <View ref={viewRef} style={{ width: 100, height: 500, backgroundColor: 'yellow' }} />
        <View style={{ width: 100, height: 500, backgroundColor: 'blue' }} />
        <View style={{ width: 100, height: 500, backgroundColor: 'gray' }} />
      </ScrollView> */}
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
    alignItems: 'center',
    paddingLeft: margin * 2,
    paddingRight: margin * 2,
    height: rowHeight,
    width,
  },
  imageContainer: {
    marginRight: margin,
  },
  image: {
    height: imageSize,
    width: imageSize,
  },
  imagePlaceholder: {
    height: imageSize,
    width: imageSize,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  imageCover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  index: {
    color: '#fff',
    fontWeight: '500',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#333333',
  },
  subtitle: {
    fontSize: 15,
    color: '#bbbbbb',
  },
  titlePlaceholder: {
    height: 18,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '60%',
    marginBottom: 5,
  },
  subtitlePlaceholder: {
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '90%',
  },
});

export default App;
