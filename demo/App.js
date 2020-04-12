import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  PixelRatio,
  Button,
  findNodeHandle,
  FlatList,
} from 'react-native';
import {
  VirtualizedScrollView,
  VirtualizedView,
} from '../src';

const { width, height } = Dimensions.get('window');
const array = Array(15).fill(0);
const rowHeight = 100;
const imageWidth = 0.6 * width;
const buttonWidth = 0.2 * width;
const restWidth = width - imageWidth - buttonWidth;

const Row = ({ index }) => {
  const uri = `https://5b0988e595225.cdn.sohucs.com/images/20180911/72d7781b49cc4a84935b381105b5a842.jpeg?index=${index}`;
  const [show, setShow] = useState(true);
  const onPress = useCallback(() => {
    setShow(!show);
  });
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
      {
        show ? (
          <Image
            style={styles.image}
            source={{ uri }}
          />
        ) : null
      }
      <Button
        style={styles.button}
        title="update"
        onPress={onPress}
      />
    </VirtualizedView>
  );
};

const App = () => {
  const renderItem = ({ index }) => (
    <Row key={index} index={index} />
  );

  // const onScroll = (event) => {
  //   console.log('onScroll', event.nativeEvent.contentOffset.y);
  // };

  return (
    <View style={styles.container}>
      <VirtualizedScrollView
        style={{
          width,
          height,
        }}
        removeClippedSubviews
        // onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View>
          <View>
            {
              array.map((_, index) => renderItem({ index: index + 1 }))
            }
          </View>
        </View>
      </VirtualizedScrollView>
      {/* <FlatList
        data={array}
        style={{ width, height }}
        renderItem={renderItem}
      /> */}
    </View>
  );
};

// class Block extends React.PureComponent {
//   componentDidMount() {
//     console.log('Block mounted');
//   }

//   componentWillUnmount() {
//     console.log('Block unmounted');
//   }

//   render = () => {
//     const { children } = this.props;
//     return (
//       <View {...this.props}>
//         { children }
//       </View>
//     )
//   }
// }

// class App extends React.PureComponent {
//   scrollViewRef = React.createRef();

//   viewRef = React.createRef();

//   state = {
//     visible: true,
//   }

//   componentDidMount() {
//     setInterval(() => {
//       this.measurePos();
//     }, 500);
//   }

//   measurePos = () => {
//     const scrollViewNode = findNodeHandle(this.scrollViewRef.current);
//     this.viewRef.current.measureLayout(
//       scrollViewNode,
//       (x, y, w, h) => {
//         console.log(`x: ${x}, y: ${y}, width: ${w}, height: ${h}`);
//       },
//     );
//   }

//   onScroll = (event) => {
//     console.log('onScroll', event.nativeEvent.contentOffset.y);
//   }

//   onLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
//     console.log('onlayout', width, height);
//   }

//   onContentSizeChange = (contentWidth, contentHeight) => {
//     console.log('onContentSizeChange', contentWidth, contentHeight);
//   }

//   render = () => {
//     const { visible } = this.state;
//     return (
//       <View style={styles.container}>
//         <View style={{ height: 500 }}>
//           <ScrollView
//             onLayout={this.onLayout}
//             onContentSizeChange={this.onContentSizeChange}
//             style={{
//               backgroundColor: 'rgba(0, 0, 0, 0.1)'
//             }}
//             ref={this.scrollViewRef}
//             onScroll={this.onScroll}
//             scrollEventThrottle={16}
//           >
//             {
//               <Block
//                 display={visible ? 'flex' : 'none'}
//                 style={{
//                   marginTop: 300,
//                   height: 300,
//                   width: 300,
//                   backgroundColor: 'pink',
//                 }}
//               />
//             }
//             <View
//               ref={this.viewRef}
//               style={{
//                 height: 300,
//                 width: 300,
//                 backgroundColor: 'orange',
//               }}
//             />
//             <Button title="test" onPress={() => this.setState({ visible: !visible })} />
//           </ScrollView>
//         </View>
//       </View>
//     );
//   }
// }

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
  button: {
    height: rowHeight,
    width: buttonWidth,
  }
});

export default App;
