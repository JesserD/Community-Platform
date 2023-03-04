import { Formik, Form, Field, FieldProps } from 'formik';
import React from 'react';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import { Box, CircularProgress, FormControl, Textarea } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

const InputField = () => {
    const { messageStore } = useStore();
    return (
        <Formik
            onSubmit={(values, { resetForm }) =>
                messageStore.addMessage(values).then(() => resetForm())}
            initialValues={{ body: '' }}
            validationSchema={Yup.object({
                body: Yup.string().required()
            })}
        >
            {({ isSubmitting, isValid, handleSubmit }) => (
                <FormControl>
                    <Form>
                        <Field name='body'>
                            {(props: FieldProps) => (
                                <Box p={3} >
                                    <CircularProgress isIndeterminate color='pink' hidden={!isSubmitting} />
                                    <Textarea bg={'white'}
                                        placeholder='Enter your message (Enter to submit, SHIFT + enter for new line)'
                                        rows={2} {...props.field}
                                        onKeyPress={e => {
                                            if (e.key === 'Enter' && e.shiftKey) {
                                                return;
                                            }
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                isValid && handleSubmit();
                                                window.scrollTo (0,0);
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </Field>
                    </Form>
                </FormControl>
            )}
        </Formik>
    );
};

export default observer(InputField);