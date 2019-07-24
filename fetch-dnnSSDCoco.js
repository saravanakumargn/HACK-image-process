const cv = require('opencv4nodejs');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const classNames = require('./dnnCocoClassNames');


// replace with path where you unzipped inception model
const ssdcocoModelPath = './data/SSD_300x300';
const Schema = mongoose.Schema;
const cameraDataSchema = new Schema(
  {
    cameraID: {
      type: String,
      required: true,
    },
    // label: String,
    name: String,
    count: Number,
    datetime: Date,
    location: {
      type: [Number],
      required: true,
    },
  },
  { 
    timestamps: false,
    // versionKey: false,
   }
);

// var dataSchema = new Schema({

  // location: {
  //   type: {
  //     type: String,
  //     enum: ['Point'],
  //     required: true,
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: true,
  //   },
  // },
//   label: String,
//   name: String,
//   confidence: Number
// });

const results = {
  "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#CameraImageSet",
  "value": [
      {
          "CameraID": "1001",
          "Latitude": 1.29531332,
          "Longitude": 103.871146,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1001_1813_20190723181804_981659.jpg"
      },
      {
          "CameraID": "1002",
          "Latitude": 1.319541067,
          "Longitude": 103.8785627,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1002_1813_20190723182000_9c9ff5.jpg"
      },
      {
          "CameraID": "1003",
          "Latitude": 1.323957439,
          "Longitude": 103.8728576,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1003_1813_20190723182000_09ef29.jpg"
      },
      {
          "CameraID": "1004",
          "Latitude": 1.319535712,
          "Longitude": 103.8750668,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1004_1813_20190723182000_4229ab.jpg"
      },
      {
          "CameraID": "1005",
          "Latitude": 1.363519886,
          "Longitude": 103.905394,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1005_1813_20190723182000_625b25.jpg"
      },
      {
          "CameraID": "1006",
          "Latitude": 1.357098686,
          "Longitude": 103.902042,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1006_1813_20190723182000_5f18fc.jpg"
      },
      {
          "CameraID": "1501",
          "Latitude": 1.27414394350065,
          "Longitude": 103.851316802547,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1501_1808_20190723181503_881bad.jpg"
      },
      {
          "CameraID": "1502",
          "Latitude": 1.27135090682664,
          "Longitude": 103.861828440597,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1502_1808_20190723181500_246c36.jpg"
      },
      {
          "CameraID": "1503",
          "Latitude": 1.27066408655104,
          "Longitude": 103.856977943394,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1503_1808_20190723181500_5eaaf1.jpg"
      },
      {
          "CameraID": "1504",
          "Latitude": 1.29409891409364,
          "Longitude": 103.876056196568,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1504_1808_20190723181500_780232.jpg"
      },
      {
          "CameraID": "1505",
          "Latitude": 1.2752977149006,
          "Longitude": 103.866390381759,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1505_1808_20190723181500_78426a.jpg"
      },
      {
          "CameraID": "1701",
          "Latitude": 1.323604823,
          "Longitude": 103.8587802,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1701_1818_20190723182000_ccf9cf.jpg"
      },
      {
          "CameraID": "1702",
          "Latitude": 1.34355015,
          "Longitude": 103.8601984,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1702_1818_20190723182000_d6b9d6.jpg"
      },
      {
          "CameraID": "1703",
          "Latitude": 1.32814722194857,
          "Longitude": 103.862203282048,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1703_1813_20190723181500_6342b3.jpg"
      },
      {
          "CameraID": "1704",
          "Latitude": 1.28569398886979,
          "Longitude": 103.837524510188,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1704_1817_20190723181900_f9de46.jpg"
      },
      {
          "CameraID": "1705",
          "Latitude": 1.375925022,
          "Longitude": 103.8587986,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1705_1818_20190723182000_f98239.jpg"
      },
      {
          "CameraID": "1706",
          "Latitude": 1.38861,
          "Longitude": 103.85806,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1706_1818_20190723182000_e668c4.jpg"
      },
      {
          "CameraID": "1707",
          "Latitude": 1.28036584335876,
          "Longitude": 103.830451146503,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1707_1818_20190723182001_61de30.jpg"
      },
      {
          "CameraID": "1709",
          "Latitude": 1.31384231654635,
          "Longitude": 103.845603032574,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1709_1818_20190723182000_12ab4c.jpg"
      },
      {
          "CameraID": "1711",
          "Latitude": 1.35296,
          "Longitude": 103.85719,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/1711_1818_20190723182000_f597e6.jpg"
      },
      {
          "CameraID": "2701",
          "Latitude": 1.447023728,
          "Longitude": 103.7716543,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/2701_1818_20190723182000_3eb7e1.jpg"
      },
      {
          "CameraID": "2702",
          "Latitude": 1.445554109,
          "Longitude": 103.7683397,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/2702_1818_20190723182000_13e0ca.jpg"
      },
      {
          "CameraID": "2703",
          "Latitude": 1.35047790791386,
          "Longitude": 103.791033581325,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/2703_1813_20190723181501_6ca1f4.jpg"
      },
      {
          "CameraID": "2704",
          "Latitude": 1.429588536,
          "Longitude": 103.769311,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/2704_1816_20190723181801_35bbdc.jpg"
      },
      {
          "CameraID": "2705",
          "Latitude": 1.36728572,
          "Longitude": 103.7794698,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/2705_1816_20190723181801_d569f6.jpg"
      },
      {
          "CameraID": "2706",
          "Latitude": 1.414142,
          "Longitude": 103.771168,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/2706_1816_20190723181801_ed1f89.jpg"
      },
      {
          "CameraID": "2707",
          "Latitude": 1.3983,
          "Longitude": 103.774247,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/2707_1816_20190723181801_b5da59.jpg"
      },
      {
          "CameraID": "2708",
          "Latitude": 1.3865,
          "Longitude": 103.7747,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/2708_1816_20190723181801_9e0de1.jpg"
      },
      {
          "CameraID": "3702",
          "Latitude": 1.33831,
          "Longitude": 103.98032,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/3702_1816_20190723181801_b5b650.jpg"
      },
      {
          "CameraID": "3704",
          "Latitude": 1.2958550156561,
          "Longitude": 103.880314665981,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/3704_1816_20190723181801_9d5b71.jpg"
      },
      {
          "CameraID": "3705",
          "Latitude": 1.32743,
          "Longitude": 103.97383,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/3705_1816_20190723181801_840d0b.jpg"
      },
      {
          "CameraID": "3793",
          "Latitude": 1.309330837,
          "Longitude": 103.9350504,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/3793_1816_20190723181801_03566e.jpg"
      },
      {
          "CameraID": "3795",
          "Latitude": 1.30145145166066,
          "Longitude": 103.910596320237,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/3795_1807_20190723180900_5251f1.jpg"
      },
      {
          "CameraID": "3796",
          "Latitude": 1.297512569,
          "Longitude": 103.8983019,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/3796_1812_20190723181501_f91b07.jpg"
      },
      {
          "CameraID": "3797",
          "Latitude": 1.29565733262976,
          "Longitude": 103.885283049309,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/3797_1807_20190723180900_8b05ae.jpg"
      },
      {
          "CameraID": "3798",
          "Latitude": 1.29158484,
          "Longitude": 103.8615987,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/3798_1813_20190723181501_aa65ea.jpg"
      },
      {
          "CameraID": "4701",
          "Latitude": 1.2871,
          "Longitude": 103.79633,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4701_1813_20190723181502_548f83.jpg"
      },
      {
          "CameraID": "4702",
          "Latitude": 1.27237,
          "Longitude": 103.8324,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4702_1813_20190723181501_72cd47.jpg"
      },
      {
          "CameraID": "4703",
          "Latitude": 1.348697862,
          "Longitude": 103.6350413,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4703_1817_20190723181900_d34ec4.jpg"
      },
      {
          "CameraID": "4704",
          "Latitude": 1.27877,
          "Longitude": 103.82375,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4704_1816_20190723181802_db5600.jpg"
      },
      {
          "CameraID": "4705",
          "Latitude": 1.32618,
          "Longitude": 103.73028,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4705_1816_20190723181802_79d764.jpg"
      },
      {
          "CameraID": "4706",
          "Latitude": 1.29792,
          "Longitude": 103.78205,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4706_1816_20190723181802_99d128.jpg"
      },
      {
          "CameraID": "4707",
          "Latitude": 1.33344648135658,
          "Longitude": 103.652700847056,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4707_1816_20190723181802_70322a.jpg"
      },
      {
          "CameraID": "4708",
          "Latitude": 1.29939,
          "Longitude": 103.7799,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4708_1816_20190723181802_6cbf23.jpg"
      },
      {
          "CameraID": "4709",
          "Latitude": 1.312019,
          "Longitude": 103.763002,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4709_1816_20190723181802_409959.jpg"
      },
      {
          "CameraID": "4710",
          "Latitude": 1.32153,
          "Longitude": 103.75273,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4710_1818_20190723182001_dd90f7.jpg"
      },
      {
          "CameraID": "4712",
          "Latitude": 1.341244001,
          "Longitude": 103.6439134,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4712_1816_20190723181802_6e29fa.jpg"
      },
      {
          "CameraID": "4713",
          "Latitude": 1.347645829,
          "Longitude": 103.6366955,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4713_1818_20190723182000_41e573.jpg"
      },
      {
          "CameraID": "4714",
          "Latitude": 1.31023,
          "Longitude": 103.76438,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4714_1816_20190723181802_8be7ae.jpg"
      },
      {
          "CameraID": "4716",
          "Latitude": 1.32227,
          "Longitude": 103.67453,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4716_1816_20190723181802_a1a535.jpg"
      },
      {
          "CameraID": "4798",
          "Latitude": 1.25999999687243,
          "Longitude": 103.823611110166,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4798_1816_20190723181802_9ea63f.jpg"
      },
      {
          "CameraID": "4799",
          "Latitude": 1.26027777363278,
          "Longitude": 103.823888890049,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/4799_1814_20190723181802_59a8eb.jpg"
      },
      {
          "CameraID": "5794",
          "Latitude": 1.3309693,
          "Longitude": 103.9168616,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/5794_1816_20190723181802_0bd09b.jpg"
      },
      {
          "CameraID": "5795",
          "Latitude": 1.326024822,
          "Longitude": 103.905625,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/5795_1816_20190723181802_7f4d98.jpg"
      },
      {
          "CameraID": "5797",
          "Latitude": 1.322875288,
          "Longitude": 103.8910793,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/5797_1816_20190723181802_02d616.jpg"
      },
      {
          "CameraID": "5798",
          "Latitude": 1.32036078126842,
          "Longitude": 103.877174116489,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/5798_1815_20190723181802_78d12e.jpg"
      },
      {
          "CameraID": "5799",
          "Latitude": 1.328171608,
          "Longitude": 103.8685191,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/5799_1816_20190723181802_16072f.jpg"
      },
      {
          "CameraID": "6701",
          "Latitude": 1.329334,
          "Longitude": 103.858222,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6701_1816_20190723181802_f9bbe1.jpg"
      },
      {
          "CameraID": "6703",
          "Latitude": 1.328899,
          "Longitude": 103.84121,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6703_1816_20190723181802_573a33.jpg"
      },
      {
          "CameraID": "6704",
          "Latitude": 1.32657403632366,
          "Longitude": 103.826857295633,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6704_1816_20190723181802_0624fd.jpg"
      },
      {
          "CameraID": "6705",
          "Latitude": 1.332124,
          "Longitude": 103.81768,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6705_1816_20190723181803_529dd5.jpg"
      },
      {
          "CameraID": "6706",
          "Latitude": 1.349428893,
          "Longitude": 103.7952799,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6706_1816_20190723181802_cf20c5.jpg"
      },
      {
          "CameraID": "6708",
          "Latitude": 1.345996,
          "Longitude": 103.69016,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6708_1817_20190723181803_7b1d42.jpg"
      },
      {
          "CameraID": "6710",
          "Latitude": 1.344205,
          "Longitude": 103.78577,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6710_1816_20190723181802_b9c60b.jpg"
      },
      {
          "CameraID": "6711",
          "Latitude": 1.33771,
          "Longitude": 103.977827,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6711_1817_20190723181803_04da90.jpg"
      },
      {
          "CameraID": "6712",
          "Latitude": 1.332691,
          "Longitude": 103.770278,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6712_1816_20190723181803_2c9e21.jpg"
      },
      {
          "CameraID": "6713",
          "Latitude": 1.340298,
          "Longitude": 103.945652,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6713_1817_20190723181803_6a3c10.jpg"
      },
      {
          "CameraID": "6714",
          "Latitude": 1.361742,
          "Longitude": 103.703341,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6714_1817_20190723181803_f0ba24.jpg"
      },
      {
          "CameraID": "6715",
          "Latitude": 1.356299,
          "Longitude": 103.716071,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6715_1817_20190723181803_9368f7.jpg"
      },
      {
          "CameraID": "6716",
          "Latitude": 1.322893,
          "Longitude": 103.663505,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/6716_1817_20190723181803_b1a88a.jpg"
      },
      {
          "CameraID": "7791",
          "Latitude": 1.354245,
          "Longitude": 103.963782,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/7791_1817_20190723181803_58d418.jpg"
      },
      {
          "CameraID": "7793",
          "Latitude": 1.37704704,
          "Longitude": 103.92946983,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/7793_1817_20190723181804_15aebc.jpg"
      },
      {
          "CameraID": "7794",
          "Latitude": 1.37988658,
          "Longitude": 103.92009174,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/7794_1817_20190723181803_b51d0c.jpg"
      },
      {
          "CameraID": "7795",
          "Latitude": 1.38432741,
          "Longitude": 103.91585701,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/7795_1817_20190723181804_491614.jpg"
      },
      {
          "CameraID": "7796",
          "Latitude": 1.39559294,
          "Longitude": 103.90515712,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/7796_1817_20190723181803_1800af.jpg"
      },
      {
          "CameraID": "7797",
          "Latitude": 1.40002575,
          "Longitude": 103.85702534,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/7797_1817_20190723181804_45afe4.jpg"
      },
      {
          "CameraID": "7798",
          "Latitude": 1.39748842,
          "Longitude": 103.85400467,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/7798_1817_20190723181803_fb79b9.jpg"
      },
      {
          "CameraID": "8701",
          "Latitude": 1.38647,
          "Longitude": 103.74143,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/8701_1817_20190723181804_eeba4d.jpg"
      },
      {
          "CameraID": "8702",
          "Latitude": 1.39059,
          "Longitude": 103.7717,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/8702_1817_20190723181803_421f80.jpg"
      },
      {
          "CameraID": "8704",
          "Latitude": 1.3899,
          "Longitude": 103.74843,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/8704_1817_20190723181804_0c38e9.jpg"
      },
      {
          "CameraID": "8706",
          "Latitude": 1.3664,
          "Longitude": 103.70899,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/8706_1817_20190723181803_5502f4.jpg"
      },
      {
          "CameraID": "9701",
          "Latitude": 1.39466333,
          "Longitude": 103.83474601,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/9701_1816_20190723181804_ead037.jpg"
      },
      {
          "CameraID": "9702",
          "Latitude": 1.39474081,
          "Longitude": 103.81797086,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/9702_1817_20190723181803_22aaed.jpg"
      },
      {
          "CameraID": "9703",
          "Latitude": 1.422857,
          "Longitude": 103.773005,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/9703_1817_20190723181804_047c24.jpg"
      },
      {
          "CameraID": "9704",
          "Latitude": 1.42214311,
          "Longitude": 103.79542062,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/9704_1817_20190723181804_954009.jpg"
      },
      {
          "CameraID": "9705",
          "Latitude": 1.42627712,
          "Longitude": 103.78716637,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/9705_1817_20190723181804_502f2e.jpg"
      },
      {
          "CameraID": "9706",
          "Latitude": 1.41270056,
          "Longitude": 103.80642712,
          "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-23/18-22/9706_1816_20190723181800_813129.jpg"
      }
  ]
};
const CameraData = mongoose.model('Database', cameraDataSchema);

// var dataDetails = mongoose.model('datavalues', dataSchema);
/**
 * Connect to MongoDB.
 */
const MONGODB_URI = 'mongodb://localhost:27017/hack_app';
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(MONGODB_URI);
mongoose.connection.on('error', err => {
  console.error(err);
  console.log(
    '%s MongoDB connection error. Please make sure MongoDB is running.'
  );
  process.exit();
});

const prototxt = path.resolve(ssdcocoModelPath, 'deploy.prototxt');
const modelFile = path.resolve(
  ssdcocoModelPath,
  'VGG_coco_SSD_300x300_iter_400000.caffemodel'
);

if (!fs.existsSync(prototxt) || !fs.existsSync(modelFile)) {
  console.log('could not find ssdcoco model');
  console.log(
    'download the model from: https://drive.google.com/file/d/0BzKzrI_SkD1_dUY1Ml9GRTFpUWc/view'
  );
  throw new Error('exiting: could not find ssdcoco model');
}
const fetchData = async (url, parameters = {}) => {
  // let results = null;
  //   await fetch('http://datamall2.mytransport.sg/ltaodataservice/Traffic-Images', {
  //     method: 'GET',
  //     // body:    JSON.stringify(body),
  //     headers: { 'Content-Type': 'application/json', AccountKey: 'kzlesW8dS92tEC31eTEYVw==' },
  //   })
  //     .then(res => res.text())
  //     .then(body => {
  //       results = body;
  //     });
  // return results;
  return results;
  // return {results: ''};
};

// initialize ssdcoco model from prototxt and modelFile
const net = cv.readNetFromCaffe(prototxt, modelFile);

const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
  image.drawRectangle(rect, color, opts.thickness, cv.LINE_8);

const extractResults = function(outputBlob, imgDimensions) {
  return Array(outputBlob.rows)
    .fill(0)
    .map((res, i) => {
      const classLabel = outputBlob.at(i, 1);
      const confidence = outputBlob.at(i, 2);
      const bottomLeft = new cv.Point(
        outputBlob.at(i, 3) * imgDimensions.cols,
        outputBlob.at(i, 6) * imgDimensions.rows
      );
      const topRight = new cv.Point(
        outputBlob.at(i, 5) * imgDimensions.cols,
        outputBlob.at(i, 4) * imgDimensions.rows
      );
      const rect = new cv.Rect(
        bottomLeft.x,
        topRight.y,
        topRight.x - bottomLeft.x,
        bottomLeft.y - topRight.y
      );

      return {
        classLabel,
        confidence,
        rect,
      };
    });
};

function classifyImg(img) {
  // ssdcoco model works with 300 x 300 images
  const imgResized = img.resize(300, 300);

  // network accepts blobs as input
  const inputBlob = cv.blobFromImage(imgResized);
  net.setInput(inputBlob);

  // forward pass input through entire network, will return
  // classification result as 1x1xNxM Mat
  let outputBlob = net.forward();
  // extract NxM Mat
  outputBlob = outputBlob.flattenFloat(
    outputBlob.sizes[2],
    outputBlob.sizes[3]
  );

  return extractResults(outputBlob, img).map(r =>
    Object.assign({}, r, { className: classNames[r.classLabel] })
  );
}

const makeDrawClassDetections = predictions => (
  drawImg,
  className,
  getColor,
  thickness = 2
) => {
  predictions
    .filter(p => classNames[p.classLabel] === className)
    .forEach(p => drawRect(drawImg, p.rect, getColor(), { thickness }));
  return drawImg;
};

const fetchingTrafficAPIAndProcess = async () => {
  const allDatas = await fetchData();
  // console.log('allDatas');
  // console.log(allDatas);
  // console.log(allDatas);
  //   const datain = {
  //     "CameraID": "8704",
  //     "Latitude": 1.3899,
  //     "Longitude": 103.74843,
  //     "ImageLink": "https://s3-ap-southeast-1.amazonaws.com/mtpdm/2019-07-22/17-48/8704_1744_20190722174503_6070b9.jpg"
  // };

  var totalUrlCount = allDatas.value.length >= 10 ? 10 : allDatas.value.length;
  var currentUrlCount = 0;
  // for (var i = 0; i < getUrlLimit; i++) {
  //     getNextUrl();
  // }

  async function getNextUrl() {
    const datain = allDatas.value[currentUrlCount++];
    // allDatas.value.forEach(async data => {
    //   console.log('1', datain.CameraID);

      const imageUrl = datain.ImageLink;
      // const fileName = imageUrl.substring(imageUrl.lastIndexOf('/')+1);
      const fileName = imageUrl.split('/').reverse()[0];
      // console.log(imageUrl.split('/').reverse()[1]);
      // console.log(imageUrl.split('/').reverse()[2]);

      const dateValue = imageUrl
        .split('/')
        .reverse()[1]
        .split('-');
      const dateTimeValue = imageUrl
        .split('/')
        .reverse()[2]
        .split('-');

      // console.log(dateValue);
      // console.log(dateTimeValue);
      var currentDateTime = new Date(
        dateTimeValue[0],
        dateTimeValue[1],
        dateTimeValue[2],
        dateValue[0],
        dateValue[1]
      );
      // console.log(currentDateTime);
    //   console.log('122', datain.CameraID);
      const fileSavePath = `./fetchimages/${fileName}`;
      const res = await fetch(imageUrl);
      await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(fileSavePath);
        res.body.pipe(fileStream);
        res.body.on('error', err => {
          reject(err);
        });
        fileStream.on('finish', function() {
          resolve();
        });
      });
      // console.log('33', datain.CameraID);
      // console.log('1', fileName);
      // const img = await cv.imreadAsync('./data/dishes.jpg');
      const img = await cv.imreadAsync(fileSavePath);
      // console.log('11 222233');
      const minConfidence = 0.2;
      // console.log('11 2');
      const predictions = await classifyImg(img).filter(
        res => res.confidence > minConfidence
      );
      // console.log('11 3 predictions');
      // // console.log(predictions);
      // if(predictions && predictions.length <= 0) {
      //   console.log('predictions empty');
      // }
      const dataSet = [];
      predictions.forEach(async (p, key, arr) => {
        // console.log(p);
        const cameraGeo = [datain.Longitude, datain.Latitude];
        // const cameraGeo = {
        //   type: 'Point',
        //   coordinates: [datain.Longitude, datain.Latitude],
        // };
        // const datasave = new CameraData({
        //   CameraID: datain.CameraID,
        //   location: cameraGeo,
        //   name: p.className,
        //   datetime: currentDateTime,
        // });
        // const datasave = new CameraData({
        //   CameraID: datain.CameraID,
        //   location: cameraGeo,
        //   label: p.classLabel,
        //   name: p.className,
        //   confidence: p.confidence.toFixed(2),
        //   datetime: currentDateTime,
        // });
        // dataSet.push(datasave);
        dataSet.push({
          cameraID: datain.CameraID,
          location: cameraGeo,
          // label: p.classLabel,
          name: p.className,
          // confidence: p.confidence.toFixed(2),
          datetime: currentDateTime,
        });
        // await datasave.save();
        if (Object.is(arr.length - 1, key)) {
          // execute last item logic
          // console.log(`Last callback call at index ${key} with value ${val}` ); 
          // console.log(dataSet);
          function groupBy(list, props) {
            return list.reduce((a, b) => {
               (a[b[props]] = a[b[props]] || []).push(b);
               return a;
            }, {});
          }
          const result = groupBy(dataSet, 'name');
        //   console.log(result);
        //   console.log('dataSet.length: ', dataSet.length);
          const data = [];
          for (let [key, value] of Object.entries(result)) {
          //   console.log(`${key}: ${value}`);
            data.push({...value[0], count: value.length});
          //   console.log(value[0])
          }
        //   console.log(data);
          await CameraData.insertMany(data, function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
      await fs.unlinkSync(fileSavePath);

      // console.log('dataSet.length: ', dataSet.length);
      
      if (currentUrlCount <= (totalUrlCount - 1)) {
        getNextUrl();
      }
    // });
  }
  getNextUrl();

};

// runDetectDishesExample();

fetchingTrafficAPIAndProcess();
// setInterval(function() {
//   fetchingTrafficAPIAndProcess();
// }, 30000);


// 30000 - 0.5 Minute
// 60000 - 1 Minute
// 120000 - 2 Minute
// 180000 - 3 Minute