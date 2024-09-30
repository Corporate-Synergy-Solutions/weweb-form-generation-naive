export default {
  editor: {
      label: {
          en: 'Form generation',
      },
  },
  properties: {
      schema: {
          label: {
              en: 'JSON schema',
          },
          type: 'Text',
          defaultValue: '',
          bindable: true,
      },
  },
  triggerEvents: [
      {
          name: 'form:submitted',
          label: { en: 'On form submitted' },
          event: {},
      },
  ],
};
