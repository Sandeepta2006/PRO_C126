import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component{
    state={image:null}
    getPermissionAsync= async()=>{
        if(Platform.OS !== 'web'){
            const{status}= await Permissions.askAsync(Permissions.CAMERA)
            if(status !== "granted"){
                alert("Sorry, need camera roll permission to get this done!")
            }
        }
    }

    componentDidMount(){
        this.getPermissionAsync()
    }

    _PickImage=async()=>{
      try{
          let result =await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
         })
          if(!result.cancelled){
            this.setState({
                image:result.data
            })
            console.log(result.uri)
          }
        }
        catch(E){
            console.log(E)
        }
      }

      uploadImage= async(uri)=>{
          const data= new FormData()
          let filename= uri.split("/")[uri.split("/").length-1] //name. 3
          let type=`image/${uri.split('.')[uri.split('.').length-1]}`//type

          const fileToUpload={uri:uri, name:filename, type:type}
          data.append("digit", fileToUpload);
          fetch(" https://fa8b-117-214-93-252.in.ngrok.io/predict-alphabet", {
            method: "POST",
            body: data,
            headers: {
              "content-type": "multipart/form-data",
            },
          })
            .then((response) => response.json())
            .then((result) => {
              console.log("Success:", result);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
      }

    render(){
        let{image} = this.state
        return(
            <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                <Button title="Pick an image from camera roll" onPress={this._PickImage}></Button>
            </View>
        )
    }
}