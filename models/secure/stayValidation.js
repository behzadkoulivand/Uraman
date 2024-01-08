const Yup = require("yup");

exports.schema = Yup.object().shape({
    title: Yup.string()
        .required("عنوان اقامت الزامی می باشد")
        .min(5, "عنوان اقامت نباید کمتر از 5 کارکتر باشد")
        .max(100, "عنوان اقامت نباید بیشتر از 100 کاراکتر باشد"),
    price: Yup.string()
        .required("اقامت جدید باید دارای قیمت باشد. لطفا قیمت را وارد کنید"),
    address: Yup.string()
        .required("وارد کردن آدرس الزامی می‌باشد"),
    phoneNumber: Yup.number()
        .required("وارد کردن شماره تلفن الزامی می باشد"),
    // thumbnail: Yup.array().min()
    // thumbnail: Yup.object().shape({
    //     name: Yup.string().required("عکس‌ها الزامی می باشند")
    // }),
    // entryDate: Yup.date().required("تاریخ ورود الزامی است"),
    // exitDate: Yup.date().required("تاریخ خروج الزامی است")
});
