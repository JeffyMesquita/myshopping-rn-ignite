import React, { useState, useEffect } from "react";
import { Alert, FlatList } from "react-native";
import storage from "@react-native-firebase/storage";

import { Container, PhotoInfo } from "./styles";
import { Header } from "../../components/Header";
import { Photo } from "../../components/Photo";
import { File, FileProps } from "../../components/File";

export function Receipts() {
  const [photos, setPhotos] = useState<FileProps[]>([]);
  const [photoSelected, setPhotoSelected] = useState<string>("");
  const [photoInfo, setPhotoInfo] = useState<string>("");
  

  const handleShowImage = async (path: string) => {    
    const urlImage = await storage().ref(path).getDownloadURL();

    if(urlImage === photoSelected){
      handleUnShowImage();
      return;
    }
    
    setPhotoSelected(urlImage);

    const info = await storage().ref(path).getMetadata();
    setPhotoInfo(`Upload realizado em: ${info.timeCreated}`);
  };

  const handleUnShowImage = async () => {
    setPhotoSelected("");
    setPhotoInfo("");
  };

  const handleDeleteImage = async (path: string) => {
    await storage()
      .ref(path)
      .delete()
      .then(() => {
        Alert.alert("Imagem deletada com sucesso!");
      })
      .catch((error) => {
        console.error(error);
      });
    setPhotoSelected("");
    setPhotoInfo("");
    setPhotos(photos.filter((photo) => photo.path !== path));
  };

  useEffect(() => {
    storage()
      .ref("images")
      .list()
      .then((result) => {
        const files = [] as FileProps[];

        result.items.forEach((file) => {
          files.push({
            name: file.name,
            path: file.fullPath,
          });
        });

        setPhotos(files);
      });
  }, [photos]);

  return (
    <Container>
      <Header title="Comprovantes" />

      <Photo uri={photoSelected} />

      <PhotoInfo>{photoInfo}</PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => {
              handleShowImage(item.path);              
            }}
            onDelete={() => {
              handleDeleteImage(item.path);
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", padding: 24 }}
      />
    </Container>
  );
}
