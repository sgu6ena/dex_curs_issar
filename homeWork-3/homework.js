export const processCartData = (cartData) => {
    cartData.map((item) => {
        const diff = item.oldPrice - item.price;
        return diff > 0 ? (item.discount = diff) : "";
    });
    cartData.map((item) => delete item.oldPrice);
    return cartData;
};

export const makeCartItemCopy = (cartItem) => {
    let clone = JSON.parse(JSON.stringify(cartItem));
    if (clone.name === "Пицца с анчоусами") {
        clone.addedIngredients.map(item=> item.count += +1);
    }

    return clone;
};

export const calcSum = (cartData) => {
    const calcSumType = (cartData, type) => {
        const arr = type ? cartData.filter((item) => item.type === type) : cartData;
        const sum = arr.reduce(
            (total, item) => (total += item.count * item.price),
            0
        );
        const count = arr.reduce((total, item) => (total += item.count), 0);
        return { sum, count };
    };
    return {
        total: calcSumType(cartData),
        water: calcSumType(cartData, "water"),
        pizza: calcSumType(cartData, "pizza"),
        other: calcSumType(cartData, "other")
    };
};

export const getCartItemsByDate = (cartData, date) => {
    const d =  new Date(date);
    const arr = cartData.filter((item) =>
        new Date(item.date.slice(0,10)).toDateString() === d.toDateString()
    );

    return date ? arr : cartData;
}

export const repeatOrder = (cartData, date) => {
    const dateNow = new Date();
    const arr = cartData.filter((item) => item['date'] === date);
    const clone = arr.map((i) => makeCartItemCopy(i));
    let id = cartData.reduce((idmax,item)=>item.id>idmax ? item.id : idmax, cartData[0].id)
    for (let item of clone) {
        item.date = dateNow.toISOString();
        item.id = `${++id}`;
    }

    return clone.concat(cartData);
};


export const addItem = (cartData, item) => {
    cartData.map((i) => (i.id === item.id ? (i.count += 1) : ""));
    return cartData;
};

export const checkPromo = (cartData) => {
    const sum = calcSum(cartData);
    const total = sum.total.sum > 1000;
    const oneBigPosition = !!cartData.filter(item=>item.count*item.price>500).length;
    //  sum.pizza.sum > 500 || sum.water.sum > 500 || sum.other.sum > 500;
    const notDiscounted = !!cartData.filter((item) => item.discount).length;
    return { total, oneBigPosition, notDiscounted };
};
