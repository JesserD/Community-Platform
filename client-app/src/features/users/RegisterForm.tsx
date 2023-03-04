import { Button, FormControl, FormErrorMessage, ModalBody, ModalFooter, ModalHeader } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';

const RegisterForm = () => {
    const { userStore } = useStore();
    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
    });
    return (
        <Formik
            initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch(error =>
                setErrors({ error }))}
            validationSchema={validationSchema}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form onSubmit={handleSubmit} autoComplete='off'>
                    <ModalBody pb={6}>
                        <ModalHeader as='h2' fontSize='lg' color={'green.400'}>Sign up to WhatsApp Clone</ModalHeader>
                        <FormControl mt={4} isInvalid={errors.error ? true : false} >
                            <FormErrorMessage >
                                <ValidationErrors errors={errors.error} />
                            </FormErrorMessage>
                            <MyTextInput name='displayName' placeholder='Display Name' />
                            <MyTextInput name='username' placeholder='Username' autoComplete='false' />
                            <MyTextInput name='email' placeholder='Email' />
                            <MyTextInput name='password' placeholder='Password' type='password' autoComplete='off' />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button isLoading={isSubmitting} colorScheme='whatsapp' type='submit' >Register</Button>
                    </ModalFooter>
                </Form>
            )}
        </Formik>
    );
};

export default observer(RegisterForm);