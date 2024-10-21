export const ToDateWord = (date = new Date(), withTime = false) => {

    date = (date instanceof Date) ? date : new Date(date);

    if (withTime) {
        return date.toLocaleDateString("pt-BR", { hour: 'numeric', minute: 'numeric' }).replace(",", " às ");
    } else {
        return date.toLocaleDateString("pt-BR", {});
    }
}