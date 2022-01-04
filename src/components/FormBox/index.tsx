import React, { useState } from "react";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { Container } from "./styles";
import { ButtonIcon } from "../ButtonIcon";
import { Input } from "../Input";

export function FormBox() {
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  async function handleProductAdd() {
    await firestore()
      .collection("products")
      .add({
        description,
        quantity,
        done: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Produto adicionado com sucesso!");
        setDescription("");
        setQuantity(0);
      })
      .catch((error) => {
        Alert.alert("Erro ao adicionar produto!");
        console.log(error);
      });

    setDescription("");
    setQuantity(0);
  }

  return (
    <Container>
      <Input
        placeholder="Nome do produto"
        size="medium"
        onChangeText={setDescription}
      />

      <Input
        placeholder="0"
        keyboardType="numeric"
        size="small"
        style={{ marginHorizontal: 8 }}
        onChangeText={(value) => setQuantity(Number(value))}
      />

      <ButtonIcon
        size="large"
        icon="add-shopping-cart"
        onPress={() => {
          handleProductAdd();
        }}
      />
    </Container>
  );
}
