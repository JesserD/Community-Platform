import React from 'react';
import { VStack, Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';

interface Props {
    errors: any;
}

const ValidationErrors = ({ errors }: Props) => {
    if (!errors) return (<></>);
    return (
        <VStack w='full'>
            {Object.entries(errors).map((err:any, i:any) => (
                <Alert status='error' key={i}>
                    <AlertIcon />
                    <AlertTitle mr={2}>{err}</AlertTitle>
                </Alert>
            ))}
        </VStack>
    );
};

export default ValidationErrors;