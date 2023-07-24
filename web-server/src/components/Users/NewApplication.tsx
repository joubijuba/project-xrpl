import { useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import classes from "../../styles/hero.module.css";
import { SubscriptionDataDto } from "../../shared/models/dtos";
import { usersApi } from "../../shared/apis/usersApi.service"

function NewApplication() {

  const { register, handleSubmit } = useForm<SubscriptionDataDto>();

  const submitHandler: SubmitHandler<SubscriptionDataDto> = async (
    values
  ) => {
    const req = await usersApi.queryTest(values)
  };

  return (
    <div className={classes.hero}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Stack direction="column" spacing={8}>
          <FormControl id="mailAddress" isRequired>
            <Stack direction={{ base: "column" }}>
              <FormLabel>Mail address</FormLabel>
              <Input {...register("mailAddress")} />
            </Stack>
          </FormControl>

          <FormControl id="phoneNumber" isRequired>
            <Stack direction={{ base: "column" }}>
              <FormLabel>Phone number</FormLabel>
              <Input {...register("phoneNumber")} />
            </Stack>
          </FormControl>

          <FormControl id="name" isRequired>
            <Stack direction={{ base: "column" }}>
              <FormLabel>Name</FormLabel>
              <Input {...register("name")} />
            </Stack>
          </FormControl>

          <FormControl id="kbis" isRequired>
            <Stack direction={{ base: "column" }}>
              <FormLabel>Kbis</FormLabel>
              <Input {...register("kbis")} />
            </Stack>
          </FormControl>

          <FormControl id="kbis" isRequired height="200px">
            <Stack direction={{ base: "column" }}>
              <FormLabel>Description</FormLabel>
              <Input {...register("description")} />
            </Stack>
          </FormControl>
        </Stack>

        <Flex direction="row-reverse">
          <Button backgroundColor="#012a4d" mt="8" type="submit" color="white">
            Submit
          </Button>
        </Flex>
      </form>
    </div>
  );
}

export default NewApplication;