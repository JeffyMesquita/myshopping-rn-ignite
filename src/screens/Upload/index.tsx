import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Photo } from "../../components/Photo";

import { Container, Content, Progress, Transferred } from "./styles";
import { Alert } from "react-native";

export function Upload() {
  const [image, setImage] = useState<string>("");
  const [bytesTransferred, setBytesTransferred] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status == "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }

  async function handleUpload() {
    if(image === '') {
      Alert.alert('Selecione uma imagem para enviar');
      return;
    }

    const fileName = new Date().getTime();
    const fileRef = storage().ref(`/images/${fileName}.png`);

    const uploadTask = fileRef.putFile(image);

    uploadTask.on("state_changed", (taskSnapshot) => {
      const percent = (
        (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(+percent);

      setBytesTransferred(
        `${taskSnapshot.bytesTransferred} / ${taskSnapshot.totalBytes}`
      );
    });

    uploadTask.then(async () => {
      const imageUrl = await fileRef.getDownloadURL();
      console.log(imageUrl);

      Alert.alert("Upload concluído com sucesso!");
      setImage("");
      setProgress(0);
      setBytesTransferred("");
    });
  }

  return (
    <Container>
      <Header title="Upload de Fotos" />

      <Content>
        <Photo uri={image} onPress={handlePickImage} />

        <Button
          title="Fazer upload"
          onPress={() => {
            handleUpload();
          }}
        />

        <Progress>{progress}%</Progress>

        <Transferred>
          {progress} de {bytesTransferred} bytes transferido
        </Transferred>
      </Content>
    </Container>
  );
}
