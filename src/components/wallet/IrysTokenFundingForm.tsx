import React, { useState } from 'react';
import { useIrys } from '../../hooks/useIrys';

interface IrysTokenFundingFormProps {
  onSuccess?: (details: any) => void;
  onError?: (error: Error) => void;
}

const IrysTokenFundingForm: React.FC<IrysTokenFundingFormProps> = ({
  onSuccess,
  onError
}) => {
  // Return null to hide this component as requested
  return null;
};

export default IrysTokenFundingForm; 