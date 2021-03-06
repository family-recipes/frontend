import React from "react";
import { withFormik, Form, Field, ErrorMessage } from "formik";
import styled from "styled-components";
import {Header, Icon, Button} from "semantic-ui-react";
import * as yup from "yup";
import axios from "axios";

import "semantic-ui-css/semantic.min.css";

const colors = {
   attention: "#ed7769",
   accent: "#4b719c",
   subtle: "#97a1a5",
   textLight: "#efedec",
   textDark: "#594236"
};
const FormOverlay = styled.div`
   background: #f26656b2;
   background: linear-gradient(74deg, #f26656b2 0%, #4b559cb2 100%);
   z-index: 1;
   width: 100%;
   height: 100%;
   position: fixed;
   top: 0;
   left: 0;
   overflow: auto;

   display: flex;
   justify-content: center;
`;
const MainForm = styled(Form)`
   background-color: ${colors.textLight};
   border-radius: 20px;
   width: 300px;
   height: 525px;
   padding: 2.25rem 2rem;
   margin-top: 5%;

   display: flex;
   flex-direction: column;
   justify-content: flex-start;
   align-items: center;
`;
const UIContainer = styled.div`
   margin: 2rem 0;
   width: 100%;
`;
const UserInput = styled(Field)`
   background-color: transparent;
   border: none;
   border-bottom: 2px solid ${colors.textDark};
   color: ${colors.textDark};
   font-size: 1.5rem;
   margin: 0.25rem 0 1.75rem;
   outline: none;
   width: 100%;
`;
const UILabel = styled.label`
   color: ${colors.textDark};
`;
const ErrorBadge = styled.p`
   margin: 0;
   position: absolute;
   color: #721c24;
   background-color: #f8d7da;
   border-color: #f5c6cb;
   border-radius: 4px;
   padding: 5px 10px;
`;

function RegisterForm ({values}) {
   return (
      <FormOverlay className="overlay" onClick={event => {
         if (event.target.matches(".overlay")) {
            values.history.push("/");
         }
      }}>
         <MainForm>
            <Header as="h1" icon textAlign="center">
               <Icon name="sign-in" circular/>
               <Header.Content>Create Account</Header.Content>
            </Header>
            <UIContainer>
               <ErrorMessage name="username" component={ErrorBadge} />
               <UILabel>Username
                  <UserInput 
                     name="username" 
                     type="text" 
                     placeholder="Enter a User Name"
                  />
               </UILabel>
               <ErrorMessage name="password" component={ErrorBadge} />
               <UILabel>Password
                  <UserInput 
                     name="password"
                     type="password" 
                     placeholder="Type a password"
                  />
               </UILabel>
               <ErrorMessage name="passwordConfirm" component={ErrorBadge} />
               <UILabel>Confirm Password
                  <UserInput 
                     name="passwordConfirm"
                     type="password" 
                     placeholder="Retype the password"
                  />
               </UILabel>
            </UIContainer>
            <Button fluid animated="fade" color="blue" type="submit">
               <Button.Content visible>Register</Button.Content>
               <Button.Content hidden>
                  <Icon name="sign-in"/>
               </Button.Content>
            </Button>
         </MainForm>
      </FormOverlay>
   );
}

export default withFormik({
   mapPropsToValues: values => {
      return {
         history: values.history,
         userLogin: values.userLogin,
         username: values.username || "",
         password: values.password || "",
         passwordConfirm: values.passwordConfirm || ""
      };
   },
   validationSchema: yup.object().shape({
      username: yup.string()
         .matches(/^[\w]+$/, "Your username may only contain letters, numbers, and underscore. ")
         .min(3, "Your username must be at least 3 characters")
         .required("Please enter a username."),
      password: yup.string()
         .matches(/^[\S]+$/, "Your password may not contain whitespace")
         .min(8, "Your password must be at least 8 characters")
         .required("Please enter a password."),
      passwordConfirm: yup.string()
         .oneOf([yup.ref("password"), null], "Passwords don't match")
         .required('Password confirm is required')
   }),
   handleSubmit: values => {
      console.log(`Send this to auth/register: {
         username: "${values.username}",
         password: "${values.password}"
      }`);

      axios
         .post("https://family-cookbook-api.herokuapp.com/auth/register", {
            username: values.username,
            password: values.password
         })
         .then(response => {
            values.userLogin(response.data);
            values.history.push("/");
         })
         .catch(error => {
            const msgWords = error.message.split(" ");
            const code = Number(msgWords[msgWords.length-1]);

            switch (code) {
               case 401:
                  console.error("There was a problem with your Username/Password!");
                  break;
               case 500:
                  console.error("There was a problem with the server!");
                  break;
               default:
                  console.error(error);
            }
         });
   }
})(RegisterForm);