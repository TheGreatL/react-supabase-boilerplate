import {Body, Container, Head, Heading, Html, Preview, Text, Section} from '@react-email/components';
import React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({name}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to our boilerplate, {name}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome aboard!</Heading>
        <Text style={text}>Hi {name},</Text>
        <Section>
          <Text style={text}>
            We're thrilled to have you here. This is a production-ready boilerplate designed to help you build faster
            and better.
          </Text>
        </Section>
        <Text style={footer}>If you have any questions, just reply to this email.</Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px'
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '17px 0 0'
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px'
};

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '12px'
};
