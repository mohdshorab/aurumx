const MetalErrorMap: Record<string, string> = {
  '1101': 'The API Key provided is invalid.',
  '1201': 'The plan is not active due to failed payments.',
  '1202': 'The account is not active or disabled.',
  '1203':
    'The quota for the current month including the grace usage is exceeded.',
  '2101':
    'Unsupported input parameters like Metal Code, Authority Code or Unit Code.',
  '2102': 'Mandatory input parameters missing from the API request.',
  '2103': 'Unsupported currency code passed as a parameter.',
  '2104':
    'The date format is invalid. Valid date format is "YYYY-MM-DD". Eg: "2023-01-25"',
  '2105':
    'The start date & end date range passed as parameters are invalid or exceeds the range limit.',
};

export default MetalErrorMap;
