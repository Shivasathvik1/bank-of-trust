package com.TrustLedger.Exception;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<String> handleCustomerNotFound(
            CustomerNotFoundException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.NOT_FOUND
        );
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors =
                new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return new ResponseEntity<>(
                errors,
                HttpStatus.BAD_REQUEST
        );
    }


    @ExceptionHandler(BankAccountNotFoundException.class)
    public ResponseEntity<String> handleBankAccountNotFound(
            BankAccountNotFoundException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.NOT_FOUND
        );
    }


    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<String> handleInsufficientBalance(
            InsufficientBalanceException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST
        );
    }


    @ExceptionHandler(BankTransactionNotFoundException.class)
    public ResponseEntity<String> handleTransactionNotFound(
            BankTransactionNotFoundException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.NOT_FOUND
        );
    }


    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<String> handleEmailAlreadyExists(
            EmailAlreadyExistsException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.CONFLICT
        );
    }


    @ExceptionHandler(UnauthorizedAccountAccessException.class)
    public ResponseEntity<String> handleUnauthorizedAccountAccess(
            UnauthorizedAccountAccessException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.FORBIDDEN
        );
    }


    @ExceptionHandler(InvalidTransferException.class)
    public ResponseEntity<String> handleInvalidTransfer(
            InvalidTransferException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST
        );
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(
            IllegalArgumentException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST
        );
    }


    @ExceptionHandler(AccountNumberAlreadyExistsException.class)
    public ResponseEntity<String> handleAccountNumberAlreadyExists(
            AccountNumberAlreadyExistsException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.CONFLICT
        );
    }


    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String> handleInvalidCredentials(
            InvalidCredentialsException exception) {

        return new ResponseEntity<>(
                exception.getMessage(),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(
            OptimisticLockingFailureException.class
    )
    public ResponseEntity<String>
    handleOptimisticLockingFailure(
            OptimisticLockingFailureException exception) {

        return ResponseEntity
                .status(
                        HttpStatus.CONFLICT
                )
                .body(
                        "This account was updated by another transaction. "
                                + "Please refresh and try again."
                );
    }

}