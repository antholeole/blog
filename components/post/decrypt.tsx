import React, { useState } from 'react'
import { Alert, Button, Card, FormControl, InputGroup } from 'react-bootstrap'
import { Eye, EyeSlashFill } from 'react-bootstrap-icons'
import { DECRYPT_PREFIX } from '../../helpers/constants'
import CryptoJS from 'crypto-js'

interface IDecryptBoxProps {
    encryptedPost: string
    onDecrypted: (decryptedPost: string) => void
}

const DecryptBox = ({ encryptedPost, onDecrypted }: React.PropsWithoutRef<IDecryptBoxProps>): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const [decryptSuccess, setDecryptSuccess] = useState<boolean | null>(null)
  const [enteredPassword, setEnteredPassword] = useState<string>('')

  const tryDecrypt = (password: string) => {
    const newContent = CryptoJS.AES.decrypt(encryptedPost, password).toString(CryptoJS.enc.Utf8)

    if (newContent.startsWith(DECRYPT_PREFIX)) {
      setDecryptSuccess(true)
      onDecrypted(newContent.replace(DECRYPT_PREFIX, ''))
    } else {
      if (decryptSuccess === false) {
        setDecryptSuccess(null)
        new Promise(resolve => setTimeout(resolve, 300)).then(() => setDecryptSuccess(false))
      } else {
        setDecryptSuccess(false)
      }
    }
  }

    let decryptStatus = <></>
    if (decryptSuccess) {
      decryptStatus = (
        <Alert className='m-4' variant={'success'}>
          Success! Enjoy your read.
        </Alert>
      )
    } else if (decryptSuccess === false) {
      decryptStatus = (
        <Alert className='m-4' variant={'danger'}>
          Sorry, that wasn&apos;t the right password.
        </Alert>
      )
    }

    return  <Card className="my-3">
        <Card.Header>This Post is Encrypted!</Card.Header>
        {decryptStatus}
        <Card.Body>
          <p>
            This post is encrypted. Enter the password below to decrypt.
          </p>
          <InputGroup className="mb-3">
            <FormControl
              type={showPassword ? 'text' : 'password'}
              onChange={(changeEvent) => setEnteredPassword(changeEvent.currentTarget.value)}
              placeholder="Password"
              aria-label="Password"
              aria-describedby="password-visible"
            />
            <InputGroup.Text
              id="password-visible"
              onClick={() => setShowPassword(!showPassword)}>
              {!showPassword ? <Eye /> : <EyeSlashFill />}
            </InputGroup.Text>
          </InputGroup>
          <Button 
          variant="primary d-block"
          onClick={() => tryDecrypt(enteredPassword)}
          >
            Decrypt
          </Button>
        </Card.Body>
      </Card>
    
  
}

export default DecryptBox