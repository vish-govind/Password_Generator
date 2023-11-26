import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

// Yup schema is used here to validate the Length of password 
// Pwd needs to have min 4 char , otherwise a message is thrown in UI
// Pwd should not have more than 16 char , otherwise a message is thrown in UI
//.required is used for mandatory value

const PasswordValidation = Yup.object().shape({
 passwordLength: Yup.number()
 .min(4, 'Password should have min of 4 characters')
 .max(16, 'Password can have max of 16 characters')
 .required('Length of password cannot be empty')
}
)

export default function App() {

  // useState is a Hook in React that reads the current state of functional variables and updates them .
  // It takes the initial state of the variable as argument
 const [password , setPassword] = useState('')
 const [isPassGenerated, setIsPassGenerated] = useState(false)

 const [lowerCase, setLowerCase] = useState(true)
 const [upperCase, setupperCase] = useState(false)
 const [numbers, setNumbers] = useState(false)
 const [symbols, setSymbols] = useState(false)

 // Based on the user's pwd criteria selection this method will create a character string 
 // and pass it on to createPwd method

 const generatePwdString = (passwordLength : number) => {
    let characterString = ''
    const upperCaseChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerCaseChar = 'abcdefghijklmnopqrstuvwxyz'
    const numericChar = '0123456789'
    const specialChar = '!@#$%^&*()_+'

    if(upperCase)
    {
      characterString += upperCaseChar 
    }
    
    if(lowerCase)
    {
      characterString += lowerCaseChar 
    }

    if(numbers)
    {
      characterString += numericChar 
    }
    
    if(symbols)
    {
      characterString += specialChar 
    }

    const finalPwd = createPwd(characterString,passwordLength)

    setPassword(finalPwd)
    setIsPassGenerated(true)
 }


// Whatever option user selects in UI is passed on as a single combined string to this function
// eg : 'A-Z0-9' if upper case and number option is selected in UI 

 const createPwd = (userSelection : String , passwordLength : number ) => {
  let result = ''
  for(let i=0; i<passwordLength; i++)
  {
    // Random index value is picked in the input string passed on to this function
    const index = Math.round(Math.random() * userSelection.length)
    result += userSelection.charAt(index)
  }
  return result
 }

 // Resetting the state back to default 

 const resetState = () => {
  setPassword('')
  setIsPassGenerated(false)
  setLowerCase(true)
  setupperCase(false)
  setNumbers(false)
  setSymbols(false)
 }


  return (
    //keyboardShouldPersistTaps prop is used to determine whether 
    //tapping the screen should dismiss the keyboard when the keyboard is displayed.
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Password Generator</Text>
          <Formik
       initialValues={{passwordLength: ''}}
       validationSchema={PasswordValidation}
       onSubmit={(values) => {
        console.log(values);
        // values.passwordLength is a String . Put + infront to convert to number
        generatePwdString(+values.passwordLength)
       }}
     >
       {({
         values,
         errors,
         touched,
         isValid,
         handleChange,
         handleSubmit,
         handleReset,
         /* and other goodies */
       }) => (
        <>
        <View style={styles.inputWrapper}>
          <View style={styles.inputColumn}>
            <Text style={styles.heading}>Password Length</Text>
            {touched.passwordLength && errors.passwordLength && (
            <Text style={styles.errorText}>{errors.passwordLength}</Text>
            )}
          </View>
          <View>
            <TextInput
            style={styles.inputStyle}
            value={values.passwordLength}
            onChangeText={handleChange('passwordLength')} 
            placeholder='Ex: 8'
            keyboardType='numeric'/>
          </View>
        </View>
      

        <View style={styles.inputWrapper}>
        <Text style={styles.heading}>Include Lowercase</Text>
        <View style={styles.bouncy}>
        <BouncyCheckbox
        disableBuiltInState
        isChecked={lowerCase}
        onPress={() => setLowerCase(!lowerCase)}
        fillColor='#29AB87'/>
        </View>
        </View>
       


        <View style={styles.inputWrapper}>
        <Text style={styles.heading}>Include Uppercase</Text>
        <View style={styles.bouncy}>
        <BouncyCheckbox
        disableBuiltInState
        isChecked={upperCase}
        onPress={() => setupperCase(!upperCase)}
        fillColor='#29AB87'/>
        </View>
        </View>
       

        <View style={styles.inputWrapper}>
        <Text style={styles.heading}>Include Numbers   </Text>
        <View style={styles.bouncy}>
        <BouncyCheckbox
        disableBuiltInState
        isChecked={numbers}
        onPress={() => setNumbers(!numbers)}
        fillColor='#29AB87'/>
        </View>
        </View>
        

        <View style={styles.inputWrapper}>
        <Text style={styles.heading}>Include SplChar     </Text>
        <View style={styles.bouncy}>
        <BouncyCheckbox
        disableBuiltInState
        isChecked={symbols}
        onPress={() => setSymbols(!symbols)}
        fillColor='#29AB87'/>
        </View>
        </View>
        


        <View style={styles.formActions}>
         <TouchableOpacity disabled={!isValid} style={styles.primaryBtn} onPress={() => handleSubmit()}>
         <Text style={styles.primaryBtnTxt}>Generate Password</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.secondaryBtn} onPress={() => {handleReset(); resetState()}}>
            <Text style={styles.secondaryBtnTxt}>Reset</Text>
            </TouchableOpacity>
        </View>
       
        </>
       )}
     </Formik>

        </View>

        {
          isPassGenerated ? (
          <View style={styles.card}>
            <Text style={styles.subTitle}>Result</Text>
            <Text style={styles.description}>Long Press to copy</Text>
            <Text selectable={true} style={styles.generatedPassword}>{password}</Text>
              </View>) : null
        }

      </SafeAreaView>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#8395A7"
  },
  formContainer: {
    //margin provides a space b/w app container and form container
    //padding provides space b/w form container and the text within it 
    margin: 15,
    padding: 15,
    backgroundColor: "#99AAAB"
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 15,
  },
  inputWrapper: {
    //margin bottom is used to provide some space after each row inside form Container
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    //backgroundColor:'#6ab04c'
  },
  inputColumn: {
    flexDirection: 'column',
  },
  bouncy:{
    marginLeft: 190
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputStyle: {
    padding: 8,
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#16213e',
  },
  heading: {
    fontSize: 15,
    color: '#000000',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3031',
  },
  primaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#1BCA9B',
  },
  primaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  secondaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#1BCA9B',
  },
  secondaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '900',
  },
  card: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
    backgroundColor: '#99AAAB',
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    color:'#000'
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: '#758283',
    marginBottom: 8,
  },
})