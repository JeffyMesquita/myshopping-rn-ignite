import React, { useState } from "react";
import auth from "@react-native-firebase/auth";

import { Container, Account, Title, Subtitle } from "./styles";
import { ButtonText } from "../../components/ButtonText";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Alert } from "react-native";

export function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleSignInAnonymously() {
    const { user } = await auth().signInAnonymously();
    console.log(user);
  }

  async function handleCreateUserAccount() {
    if (email === "" || password === "") {
      Alert.alert("Preencha todos os campos por favor!");
      return;
    }

    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("Usuário criado com sucesso");
      })
      .catch((error) => {
        console.log(error.code);

        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Este email já está em uso! Por favor, tente outro.");
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Este email não é válido! Por favor, tente outro.");
        } else if (error.code === "auth/weak-password") {
          Alert.alert("A senha deve ter no mínimo 6 caracteres!");
        } else {
          Alert.alert("Ocorreu um erro ao criar o usuário!");
        }
      });
  }

  function handleSignInWithEmailAndPassword() {
    if (email === "" || password === "") {
      Alert.alert("Preencha todos os campos por favor!");
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        console.log(user);
        Alert.alert("Login realizado com sucesso!");
      })
      .catch((error) => {
        console.log(error.code);

        if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
          Alert.alert("Usuário não encontrado. E-mail e/ou senha estão incorretos!");
        } else {
          Alert.alert("Ocorreu um erro ao fazer o login!");
        }
      });
  }

  function handleForgotPassword() {
    if (email === "") {
      Alert.alert("Preencha o campo de email!");
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert("Enviamos um link no seu e-mail para você redefinir sua senha.");
      })
      .catch((error) => {
        console.log(error.code);

        if (error.code === "auth/invalid-email") {
          Alert.alert("Este email não é válido!");
        } else if (error.code === "auth/user-not-found") {
          Alert.alert("Não foi encontrado um usuário com este e-mail!");
        } else {
          Alert.alert("Ocorreu um erro ao enviar o e-mail de recuperação de senha!");
        }
      });
  }

  return (
    <Container>
      <Title>MyShopping</Title>
      <Subtitle>monte sua lista de compra te ajudar nas compras</Subtitle>

      <Input
        placeholder="e-mail"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <Input
        placeholder="senha"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <Button
        title="Entrar"
        onPress={() => {
          handleSignInWithEmailAndPassword();
        }}
      />

      <Account>
        <ButtonText title="Recuperar senha" onPress={() => {
          handleForgotPassword();
        }} />
        <ButtonText
          title="Criar minha conta"
          onPress={() => {
            handleCreateUserAccount();
          }}
        />
      </Account>
    </Container>
  );
}
