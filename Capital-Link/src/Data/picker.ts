import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Alert } from "react-native";

// แก้ที่ฟังก์ชัน pickImageRaw
export const pickImageRaw = async () => {
  // ขอสิทธิ์เข้าถึงแกลเลอรี่
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    Alert.alert("ต้องการสิทธิ์", "ต้องอนุญาตการเข้าถึงรูปภาพก่อน");
    return null;
  }

  try {
    // เปิดแกลเลอรี่โดยตรง
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // เปิดให้แก้ไขรูปได้
      // aspect: [1, 1], // อัตราส่วน 1:1 (สี่เหลี่ยมจัตุรัส)
      quality: 1,
      allowsMultipleSelection: false, // เลือกได้เพียงรูปเดียว
    });

    // ถ้าเลือกรูปและไม่ยกเลิก
    if (!result.canceled && result.assets && result.assets.length > 0) {
      try {
        // เพิ่มการ log ข้อมูลรูปภาพที่เลือกก่อนประมวลผล
        console.log("🟢 รูปภาพที่เลือก:", {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: result.assets[0].mimeType,
        });

        // ประมวลผลรูปภาพ
        const processedImage = await objResult(result.assets[0]);

        // ตรวจสอบผลลัพธ์
        if (processedImage) {
          console.log("✅ ประมวลผลสำเร็จ, มี URI:", !!processedImage.uri);
          console.log("✅ ประมวลผลสำเร็จ, มี type:", !!processedImage.type);
          console.log("✅ ประมวลผลสำเร็จ, มี b64:", !!processedImage.b64);
          if (processedImage.b64) {
            console.log("✅ ความยาว base64:", processedImage.b64.length);
          }
        } else {
          console.log("❌ ผลลัพธ์เป็น null");
        }

        return processedImage;
      } catch (processError) {
        console.error("❌ เกิดข้อผิดพลาดในการประมวลผลรูปภาพ:", processError);
        Alert.alert(
          "เกิดข้อผิดพลาด",
          "ไม่สามารถประมวลผลรูปภาพได้ กรุณาลองใหม่"
        );
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการเลือกรูปภาพ:", error);
    Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้ กรุณาลองใหม่");
    return null;
  }
};
// 🆕 สำหรับอัปโหลดหลายรูป (ใช้กับ finDoc)
// 🆕 แก้ไขฟังก์ชัน pickMultipleImages
export const pickMultipleImages = async () => {
  // ขอสิทธิ์เข้าถึงกล้องและแกลเลอรี่
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "คุณต้องอนุญาตการเข้าถึงแกลเลอรี่เพื่อใช้งานฟีเจอร์นี้"
    );
    return [];
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      // แปลงทุกรูปภาพที่เลือกเป็นรูปแบบเดียวกับ pickImage
      const processedImages = await Promise.all(
        result.assets.map(async (asset) => {
          // ใช้ objResult ที่มีการแก้ไขให้แกร่งขึ้น
          return await processImageAsset(asset);
        })
      );

      return processedImages.filter((item) => item !== null); // กรองเอาเฉพาะที่ไม่เป็น null
    }
    return [];
  } catch (error) {
    console.error("Error picking images:", error);
    Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้ กรุณาลองใหม่");
    return [];
  }
};

// 🆕 เพิ่มฟังก์ชันใหม่สำหรับประมวลผลรูปภาพแต่ละรูป
const processImageAsset = async (asset) => {
  try {
    // ย่อขนาดรูปภาพ
    const resizedUri = await resizeImage(asset.uri);

    // อ่านเป็น Base64
    const fileContent = await FileSystem.readAsStringAsync(resizedUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // ส่งคืนข้อมูลในรูปแบบเดียวกับ pickImage
    //console.log("หลายรูป",fileContent);
    return {
      type: asset.mimeType,
      b64: fileContent,
      uri: resizedUri,
      width: asset.width,
      height: asset.height,
      fileSize: asset.fileSize,
    };
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการประมวลผลรูปภาพ:", error);
    // ส่งคืนข้อมูลที่ยังมี URI อย่างน้อย เพื่อไม่ให้เป็น null
    return {
      type: asset.mimeType,
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    };
  }
};

export const pickImage = async () => {
  // ขอสิทธิ์เข้าถึงกล้องและแกลเลอรี่
  // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
  return new Promise(async (resolve) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "You need to grant camera and gallery permissions to use this feature."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        return await objResult(result.assets[0]);
      }

      return null;
    } catch (error) {
      console.error("❌ Error selecting image:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้ กรุณาลองใหม่");
      return null;
    }
  });
};
const resizeImage = async (uri, maxSize = 800) => {
  try {
    console.log("📏 ขนาดไฟล์ก่อนย่อ:");
    await getFileSize(uri);
    // ใช้ FileSystem เพื่อรับข้อมูลภาพ
    const imageInfo = await ImageManipulator.manipulateAsync(uri, []);

    const { width, height } = imageInfo;

    // ตรวจสอบขนาดใหม่
    let newWidth = width;
    let newHeight = height;

    if (width > height) {
      if (width > maxSize) {
        newWidth = maxSize;
        newHeight = Math.floor((height * maxSize) / width);
      }
    } else {
      if (height > maxSize) {
        newHeight = maxSize;
        newWidth = Math.floor((width * maxSize) / height);
      }
    }

    // ย่อภาพและบีบอัด
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: newWidth, height: newHeight } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    // console.log("✅ รูปภาพที่ย่อแล้ว: ", result.uri);
    console.log("📏 ขนาดไฟล์หลังย่อ:");
    await getFileSize(result.uri);
    return result.uri;
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการย่อขนาดรูปภาพ: ", error);
    return uri; // ส่งคืนรูปภาพเดิมหากเกิดข้อผิดพลาด
  }
};

// const objResult = async (asset) => {
//   let fileUri = asset.uri;

//   // ตรวจสอบ mimeType ของไฟล์
//   if (asset.mimeType?.startsWith("image/")) {
//     // ถ้าเป็นรูปภาพ ให้ย่อขนาด
//     fileUri = await resizeImage(asset.uri);
//   } else if (asset.mimeType === "application/pdf") {
//     // ถ้าเป็น PDF ไม่ต้องย่อขนาด
//     console.log("📄 ไฟล์ PDF ไม่ต้องย่อขนาด");
//   } else {
//     // กรณีไฟล์ประเภทอื่นที่ไม่รองรับ
//     console.log("⚠️ ประเภทไฟล์ไม่รองรับ");
//     return null;
//   }

//   // อ่านเนื้อหาไฟล์เป็น Base64
//   const fileContent = await FileSystem.readAsStringAsync(fileUri, {
//     encoding: FileSystem.EncodingType.Base64,
//   });

//   return {
//     type: asset.mimeType,
//     b64: fileContent,
//     uri: fileUri,
//   };
// };
const objResult = async (asset) => {
  const MAX_BASE64_LENGTH = 65000;
  // biome-ignore lint/style/useConst: <explanation>
  let fileUri = asset.uri;
  let compressLevel = 0.9;

  // รองรับเฉพาะรูปภาพ
  if (!asset.mimeType?.startsWith("image/")) {
    console.log("⚠️ ประเภทไฟล์ไม่รองรับ");
    return null;
  }

  let base64 = "";
  let resized = null;

  while (compressLevel >= 0.1) {
    try {
      resized = await ImageManipulator.manipulateAsync(
        fileUri,
        [{ resize: { width: 800 } }], // หรือปรับ dynamic ขนาด
        {
          compress: compressLevel,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      base64 = resized.base64;

      console.log(
        `🌀 compress: ${compressLevel}, base64 length: ${base64.length}`
      );

      if (base64.length <= MAX_BASE64_LENGTH) {
        break; // สำเร็จ
      }

      compressLevel -= 0.1; // ลดความคมชัดลง
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการลดขนาด:", error);
      return null;
    }
  }

  if (!base64 || base64.length > MAX_BASE64_LENGTH) {
    Alert.alert("รูปภาพใหญ่เกินไป", "ไม่สามารถลดขนาดให้เล็กพอได้");
    return null;
  }

  return {
    type: asset.mimeType,
    b64: base64,
    uri: resized.uri,
  };
};

const getFileSize = async (uri) => {
  try {
    // ใช้ FileSystem เพื่อดึงข้อมูลเกี่ยวกับไฟล์
    const fileInfo = await FileSystem.getInfoAsync(uri);

    // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
    if (fileInfo.exists) {
      // ขนาดไฟล์จะถูกแสดงในหน่วยไบต์ (bytes)
      console.log(`📏 ขนาดไฟล์: ${(fileInfo.size / 1024).toFixed(2)} KB`);
      console.log(
        `📏 ขนาดไฟล์: ${(fileInfo.size / (1024 * 1024)).toFixed(2)} MB`
      );
    } else {
      console.log("❌ ไม่พบไฟล์");
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการอ่านไฟล์: ", error);
  }
};

export const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf", // กำหนดให้เลือกได้เฉพาะไฟล์ PDF
    });

    // ตรวจสอบว่า result เป็นประเภท success หรือไม่
    if (result.assets && result.assets.length > 0) {
      return await objResult(result.assets[0]);
    }
    console.log("File picker was cancelled or failed");
  } catch (error) {
    console.log("Error picking document:", error);
  }
};
