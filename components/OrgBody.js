import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    margin: 10
  },
  textInput: {
    height: 40
  }
});

class OrgBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      text: undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('ORG BODY WILL RECEIVE PROPS !!!!!!!!!');
    // console.log(nextProps);
    // this.setState({
    //   propKey: nextProps.propKey,
    //   propVal: nextProps.propVal
    // });
  }

  render() {
    const showEditor = this.state.isEditing
      ? <View>
          <TextInput
            style={[styles.textInput, styles.container, styles.border]}
            value={
              this.state.text === undefined
                ? this.props.bodyText
                : this.state.text
            }
            multiline={true}
            autoFocus={true}
            onChangeText={text => {
              this.setState({ text });
            }}
          />
          <Button
            onPress={() => {
              this.props.onUpdateNodeBody(this.state.text);
              this.setState({ isEditing: false });
            }}
            title="ok"
            color="#33aa33"
          />
          <Button
            onPress={() => {
              this.setState({ isEditing: false });
            }}
            title="cancel"
            color="#aa3333"
          />
        </View>
      : <View style={[styles.container, styles.border]}>
          <TouchableHighlight
            onPress={() => {
              this.setState({ isEditing: true });
            }}>
            <Text>{this.props.bodyText}</Text>
          </TouchableHighlight>
        </View>;
    return <View style={{ flex: 16 }}>{showEditor}</View>;
    // let ret;
    // let le = this.props.logItem;
    // text = le.text
    //   ? <Text
    //       style={{
    //         flex: 1,
    //         fontSize: 10
    //       }}>
    //       {le.text}
    //     </Text>
    //   : null;
    // switch (le.type) {
    //   case 'state':
    //     ret = (
    //       <View style={{ flex: 16 }}>
    //         <View style={{ flexDirection: 'row' }}>
    //           <View style={{ flex: 4 }}>
    //             <Text>{`State ${le.state}`}</Text>
    //           </View>
    //           <View style={{ flex: 4 }}>
    //             <Text>{`from ${le.from}`}</Text>
    //           </View>
    //           <View style={{ flex: 7 }}>
    //             <Text>{`${le.timestamp}`}</Text>
    //           </View>
    //         </View>
    //         <ScrollView horizontal={true}>
    //           {text}
    //         </ScrollView>
    //       </View>
    //     );
    //     break;
    //   case 'note':
    //     const showEditor = this.state.isEditing
    //       ? <View style={{ flex: 16 }}>
    //           <View style={{ flexDirection: 'row' }}>
    //             <View style={{ flex: 8 }}>
    //               <Text>{`Note taken on`}</Text>
    //             </View>
    //             <View style={{ flex: 7 }}>
    //               <Text>{`${le.timestamp}`}</Text>
    //             </View>
    //           </View>
    //           <View style={{}}>
    //             <TextInput
    //               style={{
    //                 flex: 1,
    //                 borderColor: 'gray',
    //                 borderWidth: 1,
    //                 height: 80,
    //                 fontSize: 10
    //               }}
    //               multiline={true}
    //               autoFocus={true}
    //               value={
    //                 this.state.text === undefined
    //                   ? le.text ? le.text : ''
    //                   : this.state.text
    //               }
    //               onChangeText={text => this.setState({ text })}
    //             />
    //             <Button
    //               onPress={() => {
    //                 // const key = this.state.propKey === undefined
    //                 //   ? this.props.propKey
    //                 //   : this.state.propKey;
    //                 this.props.onUpdateLogNote(this.props.idx, this.state.text);
    //                 this.setState({ isEditing: false });
    //               }}
    //               title="ok"
    //               color="#33aa33"
    //             />
    //             <Button
    //               onPress={() => {
    //                 this.setState({ isEditing: false });
    //               }}
    //               title="cancel"
    //               color="#aa3333"
    //             />
    //           </View>
    //         </View>
    //       : <TouchableHighlight
    //           style={{ flex: 16 }}
    //           onPress={() => this.setState({ isEditing: true })}>
    //           <View style={{ flex: 16 }}>
    //             <View style={{ flexDirection: 'row' }}>
    //               <View style={{ flex: 8 }}>
    //                 <Text>{`Note taken on`}</Text>
    //               </View>
    //               <View style={{ flex: 7 }}>
    //                 <Text>{`${le.timestamp}`}</Text>
    //               </View>
    //             </View>
    //             {text}
    //           </View>
    //         </TouchableHighlight>;
    //     ret = showEditor;
    //     break;
    //   default:
    //     ret = (
    //       <View style={{ flex: 16 }}>
    //         <Text>{`DONT KNOW WHAT TO DO HERE!!`}</Text>
    //         {text}
    //       </View>
    //     );
    //     break;
    // }
    // return (
    //   <View style={{ flexDirection: 'row' }}>
    //     <View style={{ flex: 1 }}>
    //       <TouchableHighlight
    //         onPress={() => {
    //           this.props.onRemoveLogNote(this.props.idx);
    //         }}>
    //         <Text
    //           style={{
    //             fontFamily: 'space-mono',
    //             fontSize: 12
    //           }}>
    //           {'X'}
    //         </Text>
    //       </TouchableHighlight>
    //     </View>
    //     {ret}
    //   </View>
    // );
  }
}

export default OrgBody;
