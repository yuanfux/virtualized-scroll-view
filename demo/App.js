import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  PixelRatio,
  findNodeHandle,
} from 'react-native';
// import VirtualizedScrollview from '../src';

const { width } = Dimensions.get('window');
const array = Array(100).fill(0);
const rowHeight = 100;
const imageWidth = 0.8 * width;
const restWidth = width - imageWidth;

// const App = () => {
//   const renderItem = (index) => {
//     const uri = `https://picsum.photos/1024/1024?index=${index}`;
//     return (
//       <View
//         key={index}
//         style={styles.row}
//       >
//         <View
//           style={styles.index}
//         >
//           <Text>
//             { index }
//           </Text>
//         </View>
//         <Image
//           style={styles.image}
//           source={{ uri }}
//         />
//       </View>
//     );
//   };

//   const onScroll = (event) => {
//     console.log('onScroll', event.nativeEvent.contentOffset.y);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         onScroll={onScroll}
//         scrollEventThrottle={16}
//       >
//         {
//           array.map((_, index) => renderItem(index + 1))
//         }
//       </ScrollView>
//     </View>
//   );
// };

class App extends React.PureComponent {
  scrollViewRef = React.createRef();

  viewRef = React.createRef();

  componentDidMount() {
    setInterval(() => {
      this.measurePos();
    }, 500)
  }

  measurePos = () => {
    const scrollViewNode = findNodeHandle(this.scrollViewRef.current);
    this.viewRef.current.measureLayout(
      scrollViewNode,
      (x, y, w, h) => {
        console.log(`x: ${x}, y: ${y}, width: ${w}, height: ${h}`);
      },
    );
  }

  onScroll = () => {

  }

  render = () => {
    return (
      <ScrollView
        ref={this.scrollViewRef}
        onScroll={this.onScroll}
      >
        <View
          ref={this.viewRef}
          style={{
            height: 300,
            width: 300,
            backgroundColor: 'orange',
          }}
        >
        </View>
      </ScrollView>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     height: rowHeight,
//     width,
//   },
//   index: {
//     height: rowHeight,
//     width: restWidth,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     height: rowHeight,
//     width: imageWidth,
//   },
// });

export default App;
