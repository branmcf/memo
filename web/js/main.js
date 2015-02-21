/* Global variable used to identify which user is logged in. */
var login_email = "";


/**
 * Sets all of the necessary button and link behavior when a new
 * page is loaded.
 */
function LoadPage() {
	/* Removes old bound click events. */
	$('#hiw-btn').unbind("click");
	$('#au-btn').unbind("click");
	$('#logo').unbind("click");
	$('#cu-btn').unbind("click");
	$('#si-btn').unbind("click");
	$('#si-btn2').unbind("click");
	$('#btn-signup').unbind("click");
	$('#su-link').unbind("click");
	$('#request-btn').unbind("click");
	$('#save-btn').unbind("click");
	
	/* Sets click event behavior for the How It Works button. */
	$('#hiw-btn').on("click", function() {
		$('#page-content').load("pages/how_it_works.jsp", function() {
			LoadPage();
		});
	});
	
	/* Sets click event behavior for the About Us button. */
	$('#au-btn').on("click", function() {
		$('#page-content').load("pages/about_us.jsp", function() {
			LoadPage();
		});
	});
	
	/* Sets click event behavior for the Logo/Home button. */
	$('#logo').on("click", function() {
		$('#page-content').load("pages/landing.jsp", function() {
			LoadPage();
		});
	});
	
	/* Sets click event behavior for the Contact Us button. */
	$('#cu-btn').on("click", function() {
		$('#page-content').load("pages/contact_us.jsp", function() {
			LoadPage();
		});
	});
	
	/* Sets click event behavior for the Payment button. */
	$('#p-btn').on("click", function() {
		$('#page-content').load("pages/payment.jsp", function() {
			LoadPage();
		});
	});
	
	/* Sets click event behavior for the Already a Member link. */
	$('#si-btn').on("click", function() {
		$('#page-content').load("pages/user_login.jsp", function() {
			LoadPage();
		});
	});
	
	/* Sets click event behavior for the Sign Up button on the landing page. */
	$('#btn-signup').on("click", function() {
		$('#page-content').load("pages/sign-up.jsp", function() {
			LoadPage();
		});
	});
	
	/* Sets click event behavior for the Sign Up link on the user sign in page. */
	$('#su-link').on("click", function() {
		$('#page-content').load("pages/sign-up.jsp", function() {
			LoadPage();
		});
	});
	
	/* Sets click event behavior for transaction request button on the user profile page. */
	$('#request-btn').on("click", function() {
		$('#request-match').css("display", "block");
		$('#next-request-match').css("display", "none");
		$('#request-accept').css("display", "none");
	});
}


/**
 * Temporary function that displays a transaction acceptance message.
 * 
 * @param container jQuery object representing div containing the management 
 * link that was clicked.
 */
function AcceptTransaction(container) {
	/* Initialize the ajax data string with the necessary parameters. */
	var ajaxData = "link=accept&" + container.find("form").serialize() + "&user-email=" + login_email;
	console.log(ajaxData);

	/*
	 * Makes ajax call to alter transaction info in the database and reloads the
	 * active transactions section of the user profile.
	 */
	$.ajax({
		url: "api/manage_transactions.jsp",
		type: "POST",
		data: ajaxData,
		async: false,
		success: function(data) {
			alert("Transaction accept successful.");
			LoadTransactions();
		}
	});
	
	return false;
}


/**
 * Temporary function that displays a transaction declined message with a 
 * message representing the next transaction match proposal.
 * 
 * @param container jQuery object representing div containing the management 
 * link that was clicked.
 */
function DeclineTransaction(container) {
	/* Initialize the ajax data string with the necessary parameters. */
	var ajaxData = "link=decline&" + container.find("form").serialize() + "&user-email=" + login_email;
	console.log(ajaxData);

	/*
	 * Makes ajax call to alter transaction info in the database and reloads the
	 * active transactions section of the user profile.
	 */
	$.ajax({
		url: "api/manage_transactions.jsp",
		type: "POST",
		data: ajaxData,
		async: false,
		success: function(data) {
			alert("Transaction decline successful.");
			LoadTransactions();
		}
	});
	
	return false;
}


/**
 * Temporary function that displays a transaction canceled message when the 
 * user clicks a cancel transaction link on their profile page.
 * 
 * @param container jQuery object representing div containing the management 
 * link that was clicked.
 */
function CancelTransaction(container) {
	/* Initialize the ajax data string with the necessary parameters. */
	var ajaxData = "link=cancel&" + container.find("form").serialize() + "&user-email=" + login_email;
	console.log(ajaxData);

	/*
	 * Makes ajax call to alter transaction info in the database and reloads the
	 * active transactions section of the user profile.
	 */
	$.ajax({
		url: "api/manage_transactions.jsp",
		type: "POST",
		data: ajaxData,
		async: false,
		success: function(data) {
			alert("Transaction successfully cancelled.");
			LoadTransactions();
		}
	});
	
	return false;
}


/**
 * Creates a new user entry in the user database and initializes all required
 * column values when a sign up form is submitted.
 */
function UserSignup() {
	/* Serializes user sign up form data. */
	var formData = $('#signup-form').serialize();
	
	/* Makes ajax call to store new user vital information in user database. */
	$.ajax({
		url: "api/save_user_login.jsp",
		type: "POST",
		data: formData,
		async: false,
		success: function(data) {
			/* Sets global variable to email address of user that is now logged in. */
			var dataContent = data.toString().split(";");
			login_email = dataContent[0];
			
			/* Loads the user's default preferences into the preferences form on their profile page. */
			$('#page-content').load("pages/user_profile.jsp", function() {
				$('#wallet-pref').val(dataContent[1]);
				$('#rating-pref').val(parseInt(dataContent[3]));
				$('#trans-number-pref').val(parseInt(dataContent[4]));
				$('#timeframe-pref').val(parseInt(dataContent[5]));
				$('#cash-pref').prop("checked", (dataContent[6] === "true"));
				$('#bank-wire-pref').prop("checked", (dataContent[7] === "true"));
				$('#cash-deposit-pref').prop("checked", (dataContent[8] === "true"));
				$('#paypal-pref').prop("checked", (dataContent[9] === "true"));
				$('#other-pref').prop("checked", (dataContent[10] === "true"));
				LoadTransactions();
				LoadPage();
			});
		}
	});
	
	return false;
}


/**
 * Creates a new entry in the transaction database and initializes all column values
 * when a user submits a transaction request form from their profile page.
 */
function SubmitTransaction() {
	/* Serializes transaction form data. */
	var formData = $('.request-form').serialize() + "&";
	formData += $('#trans-preferences').serialize();
	formData += SerializeCheckboxes() + "&user-email=" + login_email;
	
	/* Makes ajax call to store new transaction in database. */
	$.ajax({
		url: "api/submit_transaction.jsp",
		type: "POST",
		data: formData,
		dataType: "text",
		async: false,
		success: function(data) {
			/* Displays match information on user profile page. CHANGE LATER. */
			var dataContent = data.toString().split(";");
			var comma = "";
			for(var i = 0; i < dataContent.length-1; i++) {
				$('#request-match p').append(comma + dataContent[i]);
				comma = ", ";
			}
			
			/* Alert the user of a completed transaction and refresh their active transactions. */
			alert("Transaction submission successful.");
			LoadTransactions();
		}
	});
	
	/* Loads transaction information into the right side of the user profile. */
	$('#request-match').css("display", "block");
	$('#next-request-match').css("display", "none");
	$('#request-accept').css("display", "none");
	
	return false;
}


/**
 * Overwrites old user preferences with the new values when a user submits the save 
 * as default preferences form on their profile page.
 */
function SavePreferences() {
	/* Serializes user preferences form data. */
	var formData = $('#trans-preferences').serialize() + "&user-email=" + login_email;
	formData += SerializeCheckboxes();
	
	/* Makes ajax call to store new preferences in user database. */
	$.ajax({
		url: "api/save_preferences.jsp",
		type: "POST",
		data: formData,
		async: false
	});
	
	/* Notifies the user that the preferences have been saved. */
	alert("The current preferences have successfully been saved as your default preferences.");
	
	return false;
}


/**
 * Checks the user database for an entry with email and password values that match those
 * submitted by the sign in form. Upon success, the user's profile page is loaded and 
 * their default preferences are loaded into the preferences form on the profile page.
 */
function VerifyLogin() {
	/* Serializes user sign in form data. */
	var formData = $('#signin-form').serialize();
	
	/* Makes ajax call to verify the provided email-password combination. */
	$.ajax({
		url: "api/authenticate.jsp",
		type: "GET",
		data: formData,
		dataType: "text",
		async: false,
		success: function(data) {
			var dataContent = data.toString().split(";");
			login_email = dataContent[0];
			if(login_email == "fail") {
				/* Append message letting user know of the failed login attempt. */
				alert("Login attempt failed. Please try another email and password combination.");
			} else {
				/* Loads the user's default preferences into the preferences form on their profile page. */
				$('#page-content').load("pages/user_profile.jsp", function() {
					$('#wallet-pref').val(dataContent[1]);
					$('#location-pref').val(dataContent[2]);
					$('#rating-pref').val(parseInt(dataContent[3]));
					$('#trans-number-pref').val(parseInt(dataContent[4]));
					$('#timeframe-pref').val(parseInt(dataContent[5]));
					$('#cash-pref').prop("checked", (dataContent[6] === "true"));
					$('#bank-wire-pref').prop("checked", (dataContent[7] === "true"));
					$('#cash-deposit-pref').prop("checked", (dataContent[8] === "true"));
					$('#paypal-pref').prop("checked", (dataContent[9] === "true"));
					$('#other-pref').prop("checked", (dataContent[10] === "true"));
					LoadTransactions();
					LoadPage();
				});
			}
		}
	});
	
	return false;
}


/**
 * Loads the active transaction requests for a user to their
 * profile page upon a successful login.
 */
function LoadTransactions() {
	/* Serializes the data to be used for the ajax call. */
	var ajaxData = "user-email=" + login_email;
	
	/* Makes ajax call to retrieve user's active transactions info. */
	$.ajax({
		url: "api/view_transactions.jsp",
		type: "GET",
		data: ajaxData,
		dataType: "text",
		async: false,
		success: function(data) {
			/* Put information into the transaction management profile section. */
			var comma;
			var currentTrans;
			$('#active-transactions div').remove();
			var dataContent = data.toString().split("/");
			var length;
			for(var i = 0; i < dataContent.length; i++) {
				comma = "";
				currentTrans = dataContent[i].split(";");
				var appendStr = "<div> <p>";
				length = currentTrans.length;
				for(var j = 0; j < length-2; j++) {
					appendStr += (comma + currentTrans[j]);
					comma = ", ";
				}
				appendStr += "<form><input type='hidden' name='trans-id' value=" + currentTrans[length-2] + "><input type='hidden' name='match-id' value=" + currentTrans[length-1] + "></form>";
				appendStr += TransactionOptions(currentTrans);
				appendStr += "</p> </div>";
				console.log(appendStr);
				$('#active-transactions').append(appendStr);
			}
			ManagementLinkActivation();
		}
	});
	
	return false;
}


/**
 * Serializes the checkbox values into a string that will be used as a part of 
 * the data option in an ajax call.
 */
function SerializeCheckboxes() {
	/* Sets result to serialized string of checkbox boolean values. */
	var data = "";
	var value = $('#cash-pref').prop("checked");
	data += "&cash-pref=" + value;
	value = $('#bank-wire-pref').prop("checked");
	data += "&bank-wire-pref=" + value;
	value = $('#cash-deposit-pref').prop("checked");
	data += "&cash-deposit-pref=" + value;
	value = $('#paypal-pref').prop("checked");
	data += "&paypal-pref=" + value;
	value = $('#other-pref').prop("checked");
	data += "&other-pref=" + value;
	
	return data;
}


/**
 * Returns an html string to be appended to the transaction management
 * section of the user profile page. Returns different links based on the 
 * status of the transaction.
 * 
 * @param transData Array of strings containing the information needed to 
 * select and return the correct link options.
 */
function TransactionOptions(transData) {
	/* Sets result string to the appropriate transaction management links. */
	var result = "";
	if(transData[0].trim() == "submitted") {
		result = "<a class='response-link manage-link accept-link' href='JavaScript:void(0)'>Accept match</a> <a class='response-link manage-link decline-link' href='JavaScript:void(0)'>New match</a> <a class='response-link manage-link cancel-link' href='JavaScript:void(0)'>Cancel request</a>";
	} else if(transData[0].trim() == "matched") {
		result = "<a class='response-link manage-link decline-link' href='JavaScript:void(0)'>New match</a> <a class='response-link manage-link cancel-link' href='JavaScript:void(0)'>Cancel request</a>";
	} else if(transData[0].trim() == "pending") {
		result = "<a class='response-link manage-link cancel-link' href='JavaScript:void(0)'>Cancel request</a>";
	}
	
	return result;
}


/**
 * Helper function that assigns click event behavior to newly created 
 * transaction management links.
 */
function ManagementLinkActivation() {
	$('#active-transactions .manage-link').on("click", function() {
		var link = $(this);
		if(link.hasClass("accept-link")) {
			AcceptTransaction(link.parent());
		} else if(link.hasClass("decline-link")) {
			DeclineTransaction(link.parent());
		} else if(link.hasClass("cancel-link")) {
			CancelTransaction(link.parent());
		}
	});
}


/**
 * Helper function that builds paragraph content to post to the 
 * active transactions section of the user profile page.
 * 
 * @param data http response containing information needed to 
 * build the display paragraph.
 * @return String containing html paragraph to be displayed.
 */
function DisplayTransactionInfo(data) {
	
	return "";
}
