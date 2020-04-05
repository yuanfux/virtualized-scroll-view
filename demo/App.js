import React from 'react';
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
} from 'react-native';
import {
  VirtualizedScrollView,
  VirtualizedView,
} from '../src';

const { width, height } = Dimensions.get('window');
const array = Array(100).fill(0);
const rowHeight = 100;
const imageWidth = 0.8 * width;
const restWidth = width - imageWidth;

const App = () => {
  const renderItem = (index) => {
    const uri = `https://picsum.photos/1024/1024?index=${index}`;
    return (
      <VirtualizedView
        key={index}
        style={styles.row}
      >
        <View
          style={styles.index}
        >
          <Text>
            { index }
          </Text>
        </View>
        <Image
          style={styles.image}
          source={{ uri }}
        />
      </VirtualizedView>
    );
  };

  const onScroll = (event) => {
    console.log('onScroll', event.nativeEvent.contentOffset.y);
  };

  return (
    <View style={styles.container}>
      <VirtualizedScrollView
        style={{
          width,
          height,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {
          array.map((_, index) => renderItem(index + 1))
        }
      </VirtualizedScrollView>
    </View>
  );
};

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
//               visible && (
//                 <View
//                   style={{
//                     marginTop: 300,
//                     height: 300,
//                     width: 300,
//                     backgroundColor: 'pink',
//                   }}
//                 />
//               )
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
});

export default App;
