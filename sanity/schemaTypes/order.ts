// export default {
//     name: 'orderSummary',
//     title: 'Order Summary',
//     type: 'document',
//     fields: [
//       // {
//       //   name: 'name',
//       //   title: 'Order Title',
//       //   type: 'string',
//       //   validation: (Rule:any) => Rule.required().min(3).max(100),
//       // },
//       {
//         name: 'orderName',
//         title: 'Title',
//         type: 'string',
//         validation: (Rule:any) => Rule.required().positive().integer(),
//       },
//       {
//         name: 'totalprice',
//         title: 'Total Price',
//         type: 'number',
//         validation: (Rule:any) => Rule.required().positive(),
//       },
//       {
//         name: 'packages',
//         title: 'Packages',
//         type: 'string',
//         validation: (Rule:any) => Rule.required().positive(),
//       },

//       {
//         name: 'shipToAddress',
//         title: 'Shipping Details',
//         type: 'object',
//         fields: [
//           {
//             name: 'name',
//             title: 'Name',
//             type: 'string',
//             validation: (Rule:any) => Rule.required().min(2).max(50),
//           },
//           {
//             name: 'phone',
//             title: 'Phone Number',
//             type: 'string',
//             validation: (Rule:any) =>
//               Rule.required()
//                 .regex(/^[0-9]{10,15}$/, {
//                   name: 'Phone Number',
//                   invert: false,
//                 })
//                 .error('Enter a valid phone number'),
//           },
//           {
//             name: 'addressLine1',
//             title: 'Address Line 1',
//             type: 'string',
//             validation: (Rule:any) => Rule.required(),
//           },
//           {
//             name: 'addressLine2',
//             title: 'Address Line 2',
//             type: 'string',
//             validation: (Rule:any) => Rule.optional(),
//           },
//           {
//             name: 'cityLocality',
//             title: 'City',
//             type: 'string',
//             validation: (Rule:any) => Rule.required(),
//           },
//           {
//             name: 'stateProvince',
//             title: 'State/Province',
//             type: 'string',
//             validation: (Rule:any) => Rule.required(),
//           },
//           {
//             name: 'postalCode',
//             title: 'Postal Code',
//             type: 'string',
//             validation: (Rule:any) =>
//               Rule.required()
//                 .regex(/^[0-9]{4,10}$/, {
//                   name: 'Postal Code',
//                   invert: false,
//                 })
//                 .error('Enter a valid postal code'),
//           },
//           {
//             name: 'countryCode',
//             title: 'Country',
//             type: 'string',
//             validation: (Rule:any) => Rule.required(),
//           },
//           {
//             name: 'addressResidentialIndicator',
//             title: 'Is Residential Address?',
//             type: 'boolean',
//           },
//         ],
//       },
//     ],
//   };
  
export default {
  name: 'orderSummary',
  title: 'Order Summary',
  type: 'document',
  fields: [
    {
      name: 'totalprice',
      title: 'Total Price',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'orderItems',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productName', type: 'string' },
            { name: 'quantity', type: 'number' },
            { name: 'price', type: 'number' }
          ]
        }
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'packages',
      title: 'Packages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'weight', type: 'object', fields: [
              { name: 'value', type: 'number' },
              { name: 'unit', type: 'string' }
            ]},
            { name: 'dimensions', type: 'object', fields: [
              { name: 'height', type: 'number' },
              { name: 'width', type: 'number' },
              { name: 'length', type: 'number' },
              { name: 'unit', type: 'string' }
            ]}
          ]
        }
      ],
      validation: (Rule: any) => Rule.required(),
    },
    
    {
      name: 'shipToAddress',
      title: 'Shipping Details',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(2).max(50),
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule: any) =>
            Rule.required()
              .regex(/^[0-9]{10,15}$/, {
                name: 'Phone Number',
                invert: false,
              })
              .error('Enter a valid phone number'),
        },
        {
          name: 'addressLine1',
          title: 'Address Line 1',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'addressLine2',
          title: 'Address Line 2',
          type: 'string',
        },
        {
          name: 'cityLocality',
          title: 'City',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'stateProvince',
          title: 'State/Province',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
          validation: (Rule: any) =>
            Rule.required()
              .regex(/^[0-9]{4,10}$/, {
                name: 'Postal Code',
                invert: false,
              })
              .error('Enter a valid postal code'),
        },
        {
          name: 'countryCode',
          title: 'Country',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'addressResidentialIndicator',
          title: 'Is Residential Address?',
          type: 'boolean',
        },
      ],
    },
    {
      name: 'shipmentDetails',
      title: 'Shipment Details',
      type: 'object',
      fields: [
        {
          name: 'shipmentId',
          title: 'Shipment ID',
          type: 'string',
        },
        {
          name: 'shipDate',
          title: 'Ship Date',
          type: 'datetime',
        },
      ],
    },
  ],
};