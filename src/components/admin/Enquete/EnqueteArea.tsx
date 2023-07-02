import { cmnProps } from '../../common/cmnConst';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type Props = {
  type: string;
  title: string;
  maxLength: number | null;
  items: string[];
}
const EnqueteArea = (props: Props) => {

  const TextType = () => {
    return (
      <Box mx={2} my={2}>
        <TextField
          fullWidth
          multiline
          rows={5}
          name="text-field"
          variant="outlined"
          size="small"
          inputProps={{maxLength: props.maxLength, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
          InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
        />
        </Box>
    );   
  }

  const RadioType = () => {
    return (
      <RadioGroup name="radio-field" sx={{ mx: 2, my: 2 }}>
        { props.items.map((item, i) => (
          <FormControlLabel key={`raido-${i}`} value={item} control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>{item}</Typography>} />
        ))}
      </RadioGroup>
    );
  }

  const CheckBoxType = () => {
    return (
      <FormGroup sx={{ mx: 2, my: 2 }}>
        { props.items.map((item,i) =>
          <FormControlLabel 
            key={`checkbox-${i}`} 
            control={<Checkbox />} 
            label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{item}</Typography>} 
          />
        )}
      </FormGroup>
    );
  }

  return (
    <Box component='div' sx={{ width: '100%', border: 'solid 2px #c9c9c9', borderRadius: '4px' }}>
      <Typography variant='caption' component="div" sx={{ ml: 1, mt: 1, fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{props.title}</Typography>
      { props.type==="テキスト入力" && <TextType />}
      { props.type==="１件選択" && <RadioType />}
      { props.type==="複数選択" && <CheckBoxType />}
    </Box>
  )
}
export default EnqueteArea;
